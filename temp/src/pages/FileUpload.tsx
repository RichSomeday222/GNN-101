import React, { useState, ChangeEvent } from 'react';
import * as ort from 'onnxruntime-web';
import { analyzeGraph, softmax, loadModel, load_json } from '@/utils/utils';
import { path } from 'd3';
import { Hint, PredictionVisualizer } from './WebUtils';

interface GraphData {
	x: number[][];
	edge_index: number[][];
	y?: number[];
	batch: number[];
}

interface ClassifyGraphProps {
	graphPath: string;
	modelPath: string;
	dataComm: Function;
	changedComm: Function;
	changed: boolean;
	onPrediction: Function;
	predicted: boolean;
}

export interface IntmData {
	conv1: Float32Array;
	conv2: Float32Array;
	conv3: Float32Array;
	pooling: Float32Array;
	dropout: Float32Array;
	final: Float32Array;
}

// parameter will be the user input for json file
const ClassifyGraph: React.FC<ClassifyGraphProps> = ({ graphPath, modelPath, dataComm, changedComm, changed, onPrediction, predicted }) => {
	const [probabilities, setProbabilities] = useState<number[]>([]);
	// const [graphName, setGraphName] = useState("None");

	const classifyGraph = async () => {
		onPrediction(true)
		console.log("start classifying....a");
		const session = await loadModel(modelPath);
		const graphData: GraphData = await load_json(graphPath);
		analyzeGraph(graphData);

		// Convert `graphData` to tensor-like object expected by your ONNX model
		const xTensor = new ort.Tensor(
			"float32",
			new Float32Array(graphData.x.flat()),
			[graphData.x.length, graphData.x[0].length]
		);

		const edgeIndexTensor = new ort.Tensor(
			"int32",
			new Int32Array(graphData.edge_index.flat()),
			[graphData.edge_index.length, graphData.edge_index[0].length]
		);

		const batchTensor = new ort.Tensor(
			"int32",
			new Int32Array(graphData.batch),
			[graphData.batch.length]
		);

		const outputMap = await session.run({
			x: xTensor,
			edge_index: edgeIndexTensor,
			batch: batchTensor,
		});

		console.log(outputMap);
		const outputTensor = outputMap.final;

		//onOutputReady(outputMap)

		console.log("Conv1");
		console.log(outputMap.conv1.cpuData);

		console.log("Conv2");
		console.log(outputMap.conv2.cpuData);

		console.log("Conv3");
		console.log(outputMap.conv3.cpuData);

		console.log("Pooling");
		console.log(outputMap.pooling.cpuData);

		console.log("Dropout");
		console.log(outputMap.dropout.cpuData);

		console.log("Final");
		console.log(outputTensor);
		console.log(outputTensor.cpuData);



		const prob = softmax(outputTensor.cpuData);
		const intmData: IntmData = {
			conv1: outputMap.conv1.cpuData,
			conv2: outputMap.conv2.cpuData,
			conv3: outputMap.conv3.cpuData,
			pooling: outputMap.pooling.cpuData,
			dropout: outputMap.dropout.cpuData,
			final: outputTensor.cpuData
		};

		dataComm(intmData);
		changedComm(false);

		// setGraphName(graphPath);

		console.log("Probabilities:", prob);
		setProbabilities(prob);
	};

	const content = !predicted ?
		<div>
			<button
				onClick={classifyGraph}
				className=" border border-2 opacity-60 hover:opacity-90 hover:border-4 py-1 px-2 rounded-lg text-xl"
				style={{ color: "rgb(25, 118, 210)", borderColor: "rgb(25, 118, 210)" }}
			>
				Click to Predict!
			</button>
			<br />
		</div> : probabilities.length > 0 ? <PredictionVisualizer result={{ 'Non-Mutagenic': probabilities[0], 'Mutagenic': probabilities[1] }} /> : <span>Predicting...</span>

	return (
		<div className="flex gap-x-4 items-center mb-2">
			<div className="flex gap-x-4 justify-center items-center">
				<h1 className="text-3xl font-black">Predictions</h1>
				<Hint text='Press the "Classify a Graph" to predict' />
			</div>
			{content}
		</div>
	)
}

export default ClassifyGraph;
