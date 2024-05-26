//A web utilities file for general UI building
import { useEffect } from 'react';
import { Panel } from 'react-resizable-panels';
import * as d3 from "d3";
import {Description} from "./Description";


//single graph visualizer
export function visualizeGraph(){

}

//single matrix visualizer
export function visualizeMatrix(){

}

//button chain on the general UI
export const ButtonChain=()=>{
    return (
        <div className="flex gap-x-4">
        <div><h2 className="text-xl font-semibold">GNN Architecture</h2></div>
          <div>
          <div className="flex justify-center gap-2">
            <Hint text={"Here's the Architecture of the GNN"} />
            <button className="bg-gray-200 border border-gray-300 hover:border-black hover:bg-gray-300 text-black py-1 px-2 rounded">
              Input
            </button>
            <button className="bg-yellow-200 border border-gray-300 hover:border-black hover:bg-yellow-300 text-black py-1 px-2 rounded">
              GNNConv1
            </button>
            <button className="bg-yellow-200 border border-gray-300 hover:border-black hover:bg-yellow-300 text-black py-1 px-2 rounded">
            GNNConv2
            </button>
            <button className="bg-yellow-200 border border-gray-300 hover:border-black hover:bg-yellow-300 text-black py-1 px-2 rounded">
            GNNConv3
            </button>
            <button className="bg-blue-200 border border-gray-300 hover:border-black hover:bg-blue-300 text-black py-1 px-2 rounded">
              Global Mean Pooling
            </button>
            <button className="bg-green-200 border border-gray-300 hover:border-black hover:bg-green-300 text-black py-1 px-2 rounded">
              FC
            </button>
            <button className="bg-gray-200 border border-gray-300 hover:border-black hover:bg-gray-300 text-black py-1 px-2 rounded">
              Output
            </button>
          </div>
        </div>
      </div>
    );
}

//Math function:::
function roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
}

//text panel
export const DescriptionPanel = ()=>{
    return (
        <Panel defaultSize={30} minSize={20} className="overflow-y-scroll" style={{"overflow":"auto"}}>
          <Description />
        </Panel>
    );
}

//helper function for graph selector, generate a list of graphs to select
export function graph_list_generate(num: number){
    let res = [];
    res.push("./input_graph.json");
    for(let i=0; i<num; i++){
        res.push(`./json_data/input_graph${i}.json`);
    }
    console.log("Graphs List", res);
    return res;
}

//graph selector
interface GraphSelectorProps {
    selectedGraph: string;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    graphList: string[];
  }
  
export const GraphSelector: React.FC<GraphSelectorProps> = ({ selectedGraph, handleChange, graphList }) => {
    return (
      <select value={selectedGraph} onChange={handleChange}>
        {graphList.map((item, index) => (
          <option key={index} value={item}>Graph {index}</option>
        ))}
      </select>
    );
};

//prediction result visualizer
interface PredictionVisualizerProps {
    result: number[];
}

export const PredictionVisualizer: React.FC<PredictionVisualizerProps> = ({result})=>{
    useEffect(()=>{
        //console.log("RESULTS", result1, result2);
        //VIS
        const width = 500;
        const height = 50;

        d3.select("#predvis").selectAll("svg").remove();
        const svg = d3.select("#predvis").append("svg").attr("width", width).attr("height", height);
        const bars = svg.selectAll("rect")
            .data(result)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function(d, i){return i*25;})
            .attr("height", 20)
            .attr("width", function(d, i){return d*200;})
            .attr("fill", "gray");
        
        const texts = svg.selectAll("text")
            .data(result)
            .enter()
            .append("text")
            .text(function(d, i){return roundToTwo(d*100);})
            .attr("x", function(d, i){return d*200;})
            .attr("y", function(d, i){return i*25+12.5;})
            .attr("font-family","sans-serif")
            .attr("font-size","10px")
            .attr("fill","black")
            .attr("text-anchor", "left");
    },
    [result]);

    return (<div id='predvis'></div>);
}

import React from 'react';

interface ViewSwitchProps {
  handleChange: (newView: boolean) => void;
  current: boolean;
}

export const ViewSwitch: React.FC<ViewSwitchProps> = ({ handleChange, current }) => {
    return (
        <div className="relative inline-block w-20 h-8 select-none rounded-full cursor-pointer overflow-hidden">
      {/* Input remains hidden but is functional for toggle */}
      <input
        type="checkbox"
        id="toggle"
        className="opacity-0 absolute w-6 h-6"
        checked={current}
        onChange={() => handleChange(!current)}
      />
      {/* Label serves as the background and slider control, with added text */}
      <label
        htmlFor="toggle"
        className="block h-8 rounded-full transition-colors duration-300 ease-in-out"
        style={{ backgroundColor: current ? '#10b981' : '#3b82f6' }} // Green when true, Blue when false
      >
        {/* Only one span for the slider circle */}
        <span
          className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transform transition-all duration-300 ease-in-out ${current ? 'translate-x-12' : ''}`}
        ></span>
        {/* Text elements */}
        <span className={`absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 text-xs font-medium text-white`}>
          <span className={`${current ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ease-in-out`}>A</span>
          <span className={`${current ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-in-out`}>B</span>
        </span>
      </label>
    </div>
      );
};


//graph selector
interface ViewSelectorProps {
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    current: boolean;
  }
  
export const ViewSelector: React.FC<ViewSelectorProps> = ({ handleChange, current }) => {
    return (
        current ?
        <select onChange={(e)=>{handleChange(e)}}>
            <option value="true">Graphs View</option>
            <option value="false">Matrices View</option>
        </select>
        :
        <select onChange={(e)=>{handleChange(e)}}>
            <option value="false">Matrices View</option>
            <option value="true">Graphs View</option>
        </select>
    );
};

//explanation component
interface HintProps{
    text:string;
}

export const Hint: React.FC<HintProps> =({text})=>{
    return (
        <span 
            className='class="inline-block bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-black' 
            title={text}
        >
            ?
        </span>
    )
}


