import React, { useState, ChangeEvent } from 'react';
import { graphPrediction, nodePrediction } from '@/utils/utils';
import { Hint, PredictionVisualizer } from './WebUtils';
import { on } from 'events';
import { useEffect } from 'react';
import { IntmData, IntmDataNode } from '@/types';

interface ClassifyGraphProps {
	graphPath: string;
	modelPath: string;
	setChangedG: Function;
	setIntmData: Function;
	setPredicted: Function;
	predicted: boolean;
	probabilities: number[] | number[][];
	setProbabilities: (prob: number[]|number[][]) => void;
	onlyShownButton?: boolean;
	simulationLoading: boolean;
}

// parameter will be the user input for json file
const ClassifyGraph: React.FC<ClassifyGraphProps> = ({ graphPath, modelPath, setChangedG, setIntmData, setPredicted, predicted, probabilities, setProbabilities, onlyShownButton = false, simulationLoading }) => {
	
	
	const classifyGraph = async () => {
		setPredicted(true)

	//	const { prob, intmData } = await graphPrediction(modelPath, graphPath);

		let prob:number[]|number[][];
		let intmData:IntmData|IntmDataNode;

		if(modelPath=="./gnn_node_model.onnx") ({ prob, intmData } = await nodePrediction(modelPath, graphPath))
		else ({ prob, intmData } = await graphPrediction(modelPath, graphPath))

		setChangedG(false);
		setIntmData(intmData);

		if (Array.isArray(prob[0])) {
			setProbabilities(prob as number[][]);
		} else {
			setProbabilities(prob as number[]);
		}
	};

	const prediction = !predicted ? (
		onlyShownButton && simulationLoading ? (
			<button
				onClick={classifyGraph}
				className=" border border-2 opacity-60 hover:opacity-90 hover:border-4 py-1 px-2 rounded-lg text-xl"
				style={{ color: "rgb(25, 118, 210)", borderColor: "rgb(25, 118, 210)" }}
			>
				Click to Predict!
			</button>
		) : (onlyShownButton && 
			<div className='mt-3'>
				<span className='loading text-xl opacity-60 font-light' style={{color:"rgb(25, 118, 210"}}>Loading</span>
			</div>
				
		)
	): Array.isArray(probabilities[0]) ? (
		<div></div>
	) : probabilities.length > 0 && typeof probabilities[0] === 'number'? (
		<PredictionVisualizer result={{ 'Non-Mutagenic': probabilities[0] as number, 'Mutagenic': probabilities[1] as number }} />
	) : (
		<span>Predicting...</span>
	);
	const content = onlyShownButton ? prediction : <div className="flex gap-x-4 items-center mb-2">
		{!predicted && (
		<div className="flex gap-x-4 items-center">
			<h1 className="text-3xl font-black">Predictions</h1>
			<p className= 'mt-1 	mx-3'>No data available yet!</p>
			<Hint text='Press the "Classify a Graph" to predict' />
		</div>)}
		{prediction}
	</div>

	return content
}



export default ClassifyGraph;
