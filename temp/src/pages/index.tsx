import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { Scrollbar } from 'react-scrollbars-custom';
import GraphVisualizer from "./GraphVisualizer";
import ClassifyGraph, { IntmData } from "./FileUpload";
import { CSSTransition } from 'react-transition-group';
import MatricesVisualizer from "./MatricesVisualizer";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import {graphList, modelList} from "./const";

import {
    Sidebar,
    Selector,
    ViewSelector,
    Hint,
    ButtonChain,
    ModelButtonChain,
    ViewSwitch,
    GraphAnalysisViewer,
} from "./WebUtils";
import { Tooltip } from "react-tooltip";
import { Inter } from '@next/font/google';

export const inter = Inter({
    variable: '--font-inter',
    weight: '500',
    subsets: ['latin-ext'],
})

export const inter2 = Inter({
    variable: '--font-inter',
    weight: '200',
    subsets: ['latin-ext'],
})

export const inter3 = Inter({
    variable: '--font-inter',
    weight: '400',
    subsets: ['latin-ext'],
})

export default function Home() {

   
    const [model, setModel] = useState('graph classification');
    const [selectedGraph, setSelectedGraph] = useState("graph_2");
    const inputRef = useRef<HTMLInputElement>(null);
    const [outputData, setOutputData] = useState(null);

    const [isGraphView, setIsGraphView] = useState(true);
    const [changedG, setChangedG] = useState(true);
    const [step, setStep] = useState(1);
    const [show, setShow] = useState(false);
    const [predicted, setPredicted] = useState(false);
    //intermediate output
    const [intmData, setIntmData] = useState<IntmData | null>(null);
    const [selectedButtons, setSelectedButtons] = useState([false, false, false, false, false, false, false]);

   

    function handlePrediction(data: boolean) {
        setPredicted(data);

    }

    function handleDataComm(data: any) {
        setIntmData(data);
        console.log("SET!", intmData);
    }

    function handleChangedComm(data: boolean) {
        setChangedG(data);
        console.log("SET Changed!", data);
    }
    function handleGraphSelection(e: React.ChangeEvent<HTMLSelectElement>): void {
        setSelectedGraph(e.target.value);
        setChangedG(true);
        setPredicted(false); 
    }

    // For now leave this commented out
    // useEffect(() => {
    //     if (step < 1) {
    //         const timer = setTimeout(() => {
    //             setStep(step + 1);
    //         }, 3500); 
    //         return () => clearTimeout(timer);
    //     }
    // }, [step]);
    useEffect(() => {
        (document.body.style as any).zoom = "67%";

    }, []);
    return (
        <main className={inter.className}>
            <Head>
                <title>Graph Neural Network Visualization</title>
            </Head>
            <div className={inter2.className}>
                {step === 0 &&
                    <div style={{ paddingTop: '15%' }} className="bg-white min-h-screen flex justify-center items-center">
                        <h1 className="animate-dissolve text-6xl  font-bold text-gradient-stroke" data-text="Welcome to a Graph Neural Network Visualizer" />
                    </div>}
            </div>
            {step === 1 &&
                <div className="bg-white min-h-screen text-black">
                    <PanelGroup direction="horizontal" >
                        <div className='sidebar'  >
                            <Scrollbar noScrollX={true} removeTracksWhenNotUsed={true} maximalThumbYSize={80} disableTrackYWidthCompensation={true} trackClickBehavior={"jump" as any}

                                trackYProps={{
                                    style: {
                                        width: '15px',
                                        borderRadius: '10px',
                                        backgroundColor: '#f0f0f0',
                                        top: '0',
                                        bottom: '0',
                                    }
                                }}
                                thumbYProps={{
                                    style: {
                                        backgroundColor: '#d9d9d9',
                                        borderRadius: '10px',
                                        boxShadow: '0 5px 6px rgba(0, 0, 0, 0.25)',
                                    }
                                }}
                            >


                                <Sidebar />
                            </Scrollbar>
                        </div>


                        <Panel className="ml-4">
                            
                            <div className="flex gap-x-2 items-center" style={{ paddingTop: '40px' }}>
                                <h1 className="text-2xl font-extra-black">
                                    GNN Model: 
                                </h1>
                                {/* <div className={inter2.className}>
                                    <p className="transform translate-y-[3px] text-xl ml-10" style={{ fontWeight: 0 }}>
                                        A binary graph classification model
                                    </p>
                                </div>
                                <div className='flex items-center'>
                                    <button
                                        className="transition-transform duration-500 ease-in-out text-2xl ml-6 mt-2"
                                        style={{ transform: `rotate(${show ? '90deg' : '0deg'})`, transformOrigin: 'center' }}
                                        onClick={() => setShow(!show)}
                                        data-tooltip-content={'See more options'}
                                        data-tooltip-id='tooltip'
                                    > ⏵
                                        <Tooltip data-tooltip-id='tooltip' />
                                    </button>
                                    
                                </div> */}
                                <Selector
                                    selectedOption={model}
                                    handleChange={(e) => {
                                        setModel(e.target.value);
                                    }}
                                    OptionList={Object.keys(modelList)}
                                />
                            </div>
                            <CSSTransition in={show}
                                        timeout={300}
                                        classNames="graph"
                                        unmountOnExit>
                                            <ModelButtonChain/>
                                    </CSSTransition>
                            <hr className="border-t border-gray-300 my-4"></hr>
                            <ButtonChain selectedButtons={selectedButtons} setSelectedButtons={setSelectedButtons} predicted={predicted}/>
                            <div className="flex gap-x-4 items-center mb-3  ">
                                <div>
                                    <h1 className="text-2xl font-semibold">Input Graph</h1>
                                </div>
                                <div className="flex items-center gap-x-4 ">
                                    <Hint text={"Select a graph"} />
                                    <div className={inter3.className}>
                                        <Selector
                                            selectedOption={selectedGraph}
                                            handleChange={handleGraphSelection}
                                            OptionList={Object.keys(graphList)}
                                        />
                                    </div>

                                </div>
                            </div>

                            <GraphAnalysisViewer path={graphList[selectedGraph]} />

                            <ClassifyGraph
                                graphPath={graphList[selectedGraph]}
                                modelPath = {modelList[model]}
                                dataComm={handleDataComm}
                                changedComm={handleChangedComm}
                                changed={changedG}
                                onPrediction={handlePrediction}
                                predicted={predicted}

                            />

                            <div className="flex gap-x-4 items-center">
                                <div className="flex gap-x-4">
                                    <h2 className="text-2xl font-semibold">
                                        {isGraphView? 'Graphs View' : 'Matrices View'}
                                    </h2>
                                    <Hint
                                        text={"Change the view of GNN model"}
                                    />
                                </div>
                                <div>
                                    <ViewSwitch
                                        handleChange={() => {
                                            setIsGraphView(!isGraphView);
                                        }}
                                        current={isGraphView}
                                    />
                                </div>
                            </div>

                            {isGraphView ? (
                                <>

                                    <GraphVisualizer
                                        graph_path={graphList[selectedGraph]}
                                        intmData={intmData}
                                        changed={changedG}
                                        predicted={predicted}
                                        selectedButtons={selectedButtons}
                                    />
                                </>
                            ) : (
                                <>
                                    <MatricesVisualizer
                                        graph_path={graphList[selectedGraph]}
                                        intmData={intmData}
                                        changed={changedG}
                                        predicted={predicted}
                                        selectedButtons={selectedButtons}
                                    />
                                </>
                            )}
                        </Panel>
                    </PanelGroup>
                </div>
            }
        </main>
    );
}