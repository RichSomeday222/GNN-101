import React, { useState, ChangeEvent } from 'react';
import { graphPrediction } from '@/utils/utils';
import { Hint, PredictionVisualizer } from './WebUtils';
import { on } from 'events';


interface ClassifyGraphProps {
	graphPath: string;
	modelPath: string;
	setChangedG: Function;
	setIntmData: Function;
	setPredicted: Function;
	predicted: boolean;
	probabilities: number[];
	setProbabilities: (prob: number[]) => void;
	onlyShownButton?: boolean;
}

// parameter will be the user input for json file
const ClassifyGraph: React.FC<ClassifyGraphProps> = ({ graphPath, modelPath, setChangedG, setIntmData, setPredicted, predicted, probabilities, setProbabilities, onlyShownButton = false }) => {


	const classifyGraph = async () => {
		setPredicted(true)

		const { prob, intmData } = await graphPrediction(modelPath, graphPath);

		setChangedG(false);
		setIntmData(intmData);

		setProbabilities(prob);
	};

	const prediction = !predicted ?
		<button
			onClick={classifyGraph}
			className=" border border-2 opacity-60 hover:opacity-90 hover:border-4 py-1 px-2 rounded-lg text-xl"
			style={{ color: "rgb(25, 118, 210)", borderColor: "rgb(25, 118, 210)" }}
		>
			Click to Predict!
		</button>
		: probabilities.length > 0 ? <PredictionVisualizer result={{ 'Non-Mutagenic': probabilities[0], 'Mutagenic': probabilities[1] }} /> : <span>Predicting...</span>

	const content = onlyShownButton ? prediction : <div className="flex gap-x-4 items-center mb-2">
		<div className="flex gap-x-4 justify-center items-center">
			<h1 className="text-3xl font-black">Predictions</h1>
			<Hint text='Press the "Classify a Graph" to predict' />
		</div>
		{prediction}
	</div>

	return content
}



export default ClassifyGraph;
