import * as d3 from "d3";
import { roundToTwo } from "../components/WebUtils";
import { flipVertically, softmax } from "./utils";
import { create, all, transposeDependencies } from "mathjs";
import { injectMathSymbol, injectSVG } from "./svgUtils";
import { drawEqComponentLabel, drawScoreE } from "./matHelperUtils";


//---------------------------functions for the softmax interaction in the graph classifier------------------------------


export function drawAttnDisplayer(
    attnDisplayer: any,
    dX: number,
    dY: number,
    eij: number[],
    lgIndices: number[][],
    targetE: number,
    myColor: any,
    ithIdx: number,
    attnScore: number
) {

    console.log("lgIndices:", lgIndices)
    console.log("eij:", eij)
    console.log("ithIdx:", ithIdx)

    attnDisplayer
        .append("rect")
        .attr("x", dX + 10)
        .attr("y", dY + 10)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", 375)
        .attr("height", 250)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("class", "procVis attn-displayer");

     //   a_${lgIndices[0][0]}_${lgIndices[ithIdx][1]}

     const attnEqScore = attnDisplayer.append("g").attr("class", "procVis attn-displayer");
    
     injectMathSymbol(
        attnEqScore, dX + 250, dY + 10, 
         "./assets/SVGs/attn.svg", 
         "procVis attn-displayer", "input",
         `${lgIndices[0][0]},${lgIndices[ithIdx][1]}`
     );

    //draw the equation
    attnDisplayer
        .append("text")
        .text(
            "Attention Coefficient for " +
                `       = ${attnScore}`
        )
        .attr("x", dX + 200)
        .attr("y", dY + 25)
        .attr("text-anchor", "middle").attr("xml:space", "preserve")
        .attr("font-size", 15)
        .attr("class", "procVis attn-displayer");

    
    const eqEScore = attnDisplayer.append("g").attr("class", "procVis attn-displayer");
    
    injectMathSymbol(
        eqEScore, dX + 15, dY + 50 + 7.5, 
        "./assets/SVGs/attn.svg", 
        "procVis attn-displayer", "input",
        `${lgIndices[0][0]},${lgIndices[ithIdx][1]}`
    );
    
    attnDisplayer
        .append("text")
        .text("          =  ")
        .attr("x", dX + 15)
        .attr("y", dY + 75)
        .attr("xml:space", "preserve")
        .attr("font-size", 15)
        .attr("class", "procVis attn-displayer");

    for (let i = 0; i < eij.length; i++) {
        const escoreComponent = attnDisplayer.append("g").attr("class", "procVis attn-displayer attnE")
        .attr("id", `e-${i}`)
        .attr("index", i);
        const str = `e(${lgIndices[i][0]},${lgIndices[i][1]})`
        const offset = str.length * 2.5;


        if (i != 0) {
            
            attnDisplayer
                .append("text")
                .text("+")
                .attr("x", dX + 100 + 65 * (i) - (10))
                .attr("y", dY + 75 + 12.5)
                .attr("text-anchor", "middle")
                .attr("font-size", 15)
                .attr("class", "procVis attn-displayer");
        }

        type Point = { x: number; y: number };
        const points: Point[] = [
            { x: dX + 100, y: dY + 65 },
            { x: dX + 100 + 65 * (eij.length - 1), y: dY + 65 },
        ];

        const lineGenerator = d3
            .line<Point>() // 使用泛型指定类型
            .x((d: Point) => d.x) // 设置x坐标
            .y((d: Point) => d.y); // 设置y坐标

        const pathData = lineGenerator(points);

        // 5. 将路径添加到SVG中
        escoreComponent
            .append("path")
            .attr("d", pathData)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr("id", "targetE"); // 确保路径不被填充

        const escore = escoreComponent.append("g");
        // injectMathSymbol(
        //     escore, dX + 100 + 65 * i-7.5, dY + 75-7.5, 
        //     "./assets/SVGs/escore.svg", 
        //     "procVis attn-displayer", "input",
        //     `${lgIndices[i][0]},${lgIndices[i][1]}`);

        
        drawScoreE(escore, dX + 100 + 65 * i, dY + 75 + 9.5, lgIndices[i][0], lgIndices[i][1]);
    }

    // attnDisplayer
    //     .append("rect")
    //     .attr("x", dX + 100 + 50)
    //     .attr("y", dY + 50 - 7.5)
    //     .attr("width", 15)
    //     .attr("height", 15)
    //     .attr("fill", myColor(targetE))
    //     .attr("class", "procVis attn-displayer attnTargetE attnE")
    //     .attr("stroke", "black")
    //     .attr("index", 0);

    const escore = attnDisplayer.append("g").attr("id", 0).attr("class", "math-latex");
    // injectMathSymbol(
    //     escore, dX + 100 + 50-7.5, dY + 50-15, 
    //     "./assets/SVGs/escore.svg", 
    //     "procVis attn-displayer attnTargetE attnE", "input",
    //     `${lgIndices[0][0]},${lgIndices[ithIdx][1]}`);

    drawScoreE(escore, dX + 100 + 50-7.5, dY + 50, lgIndices[0][0], lgIndices[ithIdx][1]);



        

    // attnDisplayer
    //     .append("text")
    //     .text("exp(" + `e_${lgIndices[0][0]}_${lgIndices[ithIdx][1]}` + ")")
    //     .attr("x", dX + 100 + 50)
    //     .attr("y", dY + 50)
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", 10)
    //     .attr("class", "procVis attn-displayer attnTargetE attnE")
    //     .attr("index", 0);

    const scale = 2;
    attnDisplayer.attr("transform", `translate(${dX * (1 - scale)}, ${dY * (1 - scale)}) scale(${scale})`);

}

export function drawEScoreEquation(
    lgIndices: number[][],
    eDisplayer: any,
    jthIndexElement: number,
    dX: number,
    dY: number,
    dstVector: number[],
    srcVector: number[],
    myColor: any,
    inputVector: number[],
    layerID: number
) {
    const eqEScore = eDisplayer.append("g").attr("class", "procVis attn-displayer");
    
    injectMathSymbol(
        eqEScore, dX + 15, dY + 100 + 7.5, 
        "./assets/SVGs/escore.svg", 
        "procVis attn-displayer", "input",
        `${lgIndices[0][0]}, ${jthIndexElement}`
    );
    eDisplayer
        .append("text")
        .text(
            `          = exp(LeakyReLU(                      +                               ))`
        )
        .attr("x", dX + 15)
        .attr("y", dY + 125)
        .attr("xml:space", "preserve")
        .attr("font-size", 12)
        .attr("class", "procVis attn-displayer")
        .attr("id", "leakyRelu");

    const fontSize = 12;
    const textH = dY + 110;

    dX += 25;


    const aTs = eDisplayer.append("g").attr("id", "ats").attr("class", "math-latex");
    injectSVG(aTs, dX + 130, textH, "./assets/SVGs/a_t_s.svg", "math-latex");
    
    

    // aTs.on("mouseenter", function () {
    //     d3.select("#ats-text").style("opacity", 1);
    //     d3.select("#ats").style("opacity", 0);
        
    //     d3.selectAll(".temp").style("pointer-events", "none");

    //     eDisplayer.append("text")
    //         .text("Learnable Vector for Source")
    //         .attr("x", dX + 140 - 10 + 12.5 + 5)
    //         .attr("y", dY + 112.5 + srcVector.length * (25 / srcVector.length) + 5)
    //         .attr("class", "temp")
    //         .style("fill", "gray")
    //         .style("font-size", 5);

    //     for (let i = 0; i < dstVector.length; i++) {
    //         eDisplayer
    //             .append("rect")
    //             .attr("x", dX + 140 - 10 + 12.5)
    //             .attr("y", dY + 112.5 + i * (25 / srcVector.length))
    //             .attr("width", 2.5)
    //             .attr("height", 25 / srcVector.length)
    //             .attr("fill", myColor(srcVector[i])).attr("class", "temp");
    //         }
        
    //     })
    //     .on("mouseout", function () {
    //         d3.select("#ats").style("opacity", 1);
    //         d3.select("#ats-text").style("opacity", 0);
    //         d3.selectAll(".temp").remove();
    //     });


    const aTd = eDisplayer
    .append("g")
    .attr("id", "atd")
    .attr("class", "math-latex");

    

    injectSVG(aTd, dX + 220, textH, "./assets/SVGs/a_t_d.svg", "math-latex");
        
    // aTd.on("mouseenter", function () {
    //         d3.select("#atd").style("opacity", 0);
    //         d3.selectAll(".temp").style("pointer-events", "none");

    //         eDisplayer.append("text")
    //         .text("Learnable Vector for Destination")
    //         .attr("x", dX + 200 + 12.5 + 20)
    //         .attr("y", dY + 112.5 + dstVector.length * (25 / dstVector.length) + 5)
    //         .attr("class", "temp")
    //         .style("fill", "gray")
    //         .style("font-size", 5);

    //         for (let i = 0; i < dstVector.length; i++) {
    //             eDisplayer
    //                 .append("rect")
    //                 .attr("x", dX + 200 + 12.5 + 20)
    //                 .attr("y", dY + 112.5 + i * (25 / dstVector.length))
    //                 .attr("width", 2.5)
    //                 .attr("height", 25 / dstVector.length).attr("class", "temp")
    //                 .attr("fill", myColor(dstVector[i]))
    //                 .raise();
    //         }
    //     })
    //     .on("mouseout", function () {
    //         d3.select("#atd").style("opacity", 1);
    //         d3.selectAll(".temp").remove();
    //     });

    const x1 = eDisplayer.append("g").attr("id", "xi").attr("class", "math-latex");
    injectMathSymbol(x1, dX + 140 - 10 + 50, textH, "./assets/SVGs/vector_x.svg", "math-latex", "input", lgIndices[0][0]);

    //     x1.on("mouseenter", function () {
    //         d3.select("#xi").style("opacity", 0);
    //         d3.selectAll(".temp").style("pointer-events", "none");

    //         drawEqComponentLabel(eDisplayer, dX + 140 - 10 + 50 + inputVector.length * (25 / inputVector.length), dY + 112.5 + 12.5 + 5, "Input Vector")
            
    //         for (let i = 0; i < inputVector.length; i++) {
    //             eDisplayer
    //                 .append("rect")
    //                 .attr(
    //                     "x",
    //                     dX + 140 - 10 + 50 + i * (25 / inputVector.length)
    //                 )
    //                 .attr("y", dY + 112.5 + 12.5)
    //                 .attr("width", 25 / inputVector.length)
    //                 .attr("height", 2.5).attr("class", "temp")
    //                 .attr("fill", myColor(inputVector[i]));
    //         }
    //     })
    //     .on("mouseout", function () {
    //         d3.select("#xi").style("opacity", 1);
    //         d3.selectAll(".temp").remove();
    //     });

        const x2 = eDisplayer.append("g").attr("id", "xj").attr("class", "math-latex");
        injectMathSymbol(x2, dX + 220+ 50, textH, "./assets/SVGs/vector_x.svg", "math-latex", "input", jthIndexElement);
    
    // x2
    //     .on("mouseenter", function () {
    //         d3.select("#xj").style("opacity", 0);
    //         d3.selectAll(".temp").style("pointer-events", "none");

    //         drawEqComponentLabel(eDisplayer, dX + 200 + 20 + 50 + inputVector.length * (25 / inputVector.length), dY + 112.5 + 12.5 + 5, "Input Vector")

    //         for (let i = 0; i < inputVector.length; i++) {
    //             eDisplayer
    //                 .append("rect").attr("class", "temp")
    //                 .attr(
    //                     "x",
    //                     dX + 200 + 20 + 50 + i * (25 / inputVector.length)
    //                 )
    //                 .attr("y", dY + 112.5 + 12.5)
    //                 .attr("width", 25 / inputVector.length)
    //                 .attr("height", 2.5)
    //                 .attr("fill", myColor(inputVector[i]));
    //         }
    //     })
    //     .on("mouseout", function () {
    //         d3.select("#xj").style("opacity", 1);
    //         d3.selectAll(".temp").remove();
    //     });

    
    
        eDisplayer
            .append("text")
            .text("W")
            .attr("id", "w1").attr("class", "mathjax-latex")
            .attr("x", dX + 75 + 75 + 15 )
            .attr("y", textH + 15)
            .attr("font-size", fontSize).style("font-weight", "bold")
        eDisplayer
            .append("text")
            .text("W")
            .attr("id", "w2").attr("class", "mathjax-latex")
            .attr("x", dX + 75 + 75 + 60 + 40+5 )
            .attr("y", textH + 15)
            .attr("font-size", fontSize).style("font-weight", "bold")

            dY += 35;
            dX -= 75;

            drawEqComponentLabel(eDisplayer, dX + 200 + 25 + inputVector.length * (25 / inputVector.length) - 10, dY + 112.5 + 12.5 + 2.5, "Input Vector")
            drawEqComponentLabel(eDisplayer, dX + 200 + 25 + inputVector.length * (25 / inputVector.length) - 10, dY + 112.5 + 12.5 + 2.5 + 50, "Input Vector")
            
        eDisplayer.append("text")
            .text("Learnable Vector for Destination")
            .attr("x", dX + 140 - 10 + 12.5 + 5 - 75)
            .attr("y", dY + 112.5 + dstVector.length * (25 / dstVector.length) + 5 - 12.5)
            .attr("class", "temp")
            .style("fill", "gray")
            .style("font-size", 5);

        eDisplayer.append("text")
            .text("Learnable Vector for Source")
            .attr("x", dX + 140 - 10 + 12.5 + 5 - 75)
            .attr("y", dY + 112.5 + 50 + srcVector.length * (25 / srcVector.length) + 5 - 12.5)
            .attr("class", "temp")
            .style("fill", "gray")
            .style("font-size", 5);

        //     for (let i = 0; i < dstVector.length; i++) {
        //         eDisplayer
        //             .append("rect")
        //             .attr("x", dX + 140 +15 + i * (25 / dstVector.length))
        //             .attr("y", dY + 112.5 + 15)
        //             .attr("width", 25 / srcVector.length)
        //             .attr("height", 2.5).attr("class", "temp")
        //             .attr("fill", myColor(dstVector[i]))
        //             .raise();
        //     }

        // for (let i = 0; i < srcVector.length; i++) {
        //     eDisplayer
        //         .append("rect")
        //         .attr("x", dX + 140 + 15 + i * (25 / srcVector.length))
        //         .attr("y", dY + 112.5 + 50 + 15)
        //         .attr("width",25 / srcVector.length)
        //         .attr("height", 2.5)
        //         .attr("fill", myColor(srcVector[i])).attr("class", "temp");
        //     }

        
        //     for (let i = 0; i < inputVector.length; i++) {
        //         eDisplayer
        //             .append("rect").attr("class", "temp")
        //             .attr(
        //                 "x",
        //                 dX + 200 + 12.5 + 20
        //             )
        //             .attr("y", dY + 112.5 + i * (25 / inputVector.length))
        //             .attr("width", 2.5)
        //             .attr("height", 25 / inputVector.length)
        //             .attr("fill", myColor(inputVector[i]));
        //     }

            
        //     for (let i = 0; i < inputVector.length; i++) {
        //         eDisplayer
        //             .append("rect")
        //             .attr(
        //                 "x",
        //                 dX + 200 + 12.5 + 20
        //             )
        //             .attr("y", dY + 50 +112.5 + i * (25 / inputVector.length))
        //             .attr("width", 2.5)
        //             .attr("height", 25 / inputVector.length).attr("class", "temp")
        //             .attr("fill", myColor(inputVector[i]));
        //     }

    let imageMat = "./assets/PNGs/GATConvMat1.png";
    let imgW = 50;
    let imgH = 50;

    let offset = 0;

    if (layerID == 1) {
        imageMat = "./assets/PNGs/GATConvMat2.png";
        imgW = 25;
        imgH = 25;
        offset = 10;
    }

    // eDisplayer
    //     .append("image")
    //     .attr("xlink:href", imageMat).attr("id", "w1png")
    //     .attr("x", dX + 75 + 75 - 10 + offset + 100 + 50)
    //     .attr("y", dY + 75 + 25 + offset)
    //     .attr("width", imgW)
    //     .attr("height", imgH).attr("opacity", 0);
    
    //     drawEqComponentLabel(eDisplayer, dX + 75 + 75 + 100 - 10 + offset + 50, dY + 75 + 25 + offset + imgH + 5, "Weight Matrix")
    //     d3.select("#w1png").attr("opacity", 1); 
    eDisplayer
        .append("image")
        .attr("xlink:href", imageMat).attr("id", "w1png")
        .attr("x", dX + 75 + 75 - 10 + offset + 100 + 100)
        .attr("y", dY + 75 + 25 + offset)
        .attr("width", imgW)
        .attr("height", imgH).attr("opacity", 0);
    
        drawEqComponentLabel(eDisplayer, dX + 75 + 75 + 100 - 10 + offset + 100, dY + 75 + 25 + offset + imgH + 5, "Weight Matrix")
        d3.select("#w1png").attr("opacity", 1); 

    // drawEqComponentLabel(eDisplayer, dX + 75 + 75 + 60 + 20 + offset, dY + 75 + 25 + offset + imgH + 5, "Weight Matrix")
    // d3.select("#w2png").attr("opacity", 1); 

    // eDisplayer
    //     .append("image")
    //     .attr("xlink:href", imageMat)
    //     .attr("id", "w2png")
    //     .attr("x", dX + 75 + 75 + 60 + 20 + offset)
    //     .attr("y", dY + 75 + 25 + offset)
    //     .attr("width", imgW)
    //     .attr("height", imgH).attr("opacity", 0);

    

    
        // .on("mouseenter", function () {
        //     drawEqComponentLabel(eDisplayer, dX + 75 + 75 - 10 + offset, dY + 75 + 25 + offset + imgH + 5, "Weight Matrix")

        //     d3.selectAll(".temp").style("pointer-events", "none");
        //     d3.select("#w1").style("opacity", 0);
        //     d3.select("#w1png").attr("opacity", 1); 
        // })
        // .on("mouseout", function () {
            
        //     d3.selectAll(".temp").style("pointer-events", "none");
        //     d3.select("#w1").style("opacity", 1);
        //     d3.select("#w1png").attr("opacity", 0); 
        //     d3.selectAll(".temp").remove();
        // });



    
        // .on("mouseenter", function () {
        //     drawEqComponentLabel(eDisplayer, dX + 75 + 75 + 60 + 20 + offset, dY + 75 + 25 + offset + imgH + 5, "Weight Matrix")

        //     d3.selectAll(".temp").style("pointer-events", "none");
        //     d3.select("#w2").style("opacity", 0);
        //     d3.select("#w2png").attr("opacity", 1); 
        // })
        // .on("mouseout", function () {
        //     d3.selectAll(".temp").style("pointer-events", "none");
        //     d3.select("#w2").style("opacity", 1);
        //     d3.select("#w2png").attr("opacity", 0);
        //     d3.selectAll(".temp").remove();
        // });

        

    
    //renderMath(document.body);

}

export function drawSoftmaxDisplayer(
    pathMap: any,
    endCoord: any,
    result: number[],
    id: number,
    myColor: any
) {
    pathMap[0][id]!.style.opacity = "1";
    pathMap[1][id]!.style.opacity = "1";

    //set-up the paramtere for the math displayer
    const displayW = 250;
    const displayH = 75;

    //find coordination for the math displayer first
    const displayX = endCoord[1][0] + 30;
    const displayY = endCoord[1][1] - (displayH + 50);

    //add displayer
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX)
        .attr("y", displayY)
        .attr("width", displayW)
        .attr("height", displayH)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("class", "math-displayer")
        .lower();

    //data preparation and preprocessing
    //model outputs and the values after softmax

    const finalResult = softmax(result);

    //title fetch
    let title = "Softmax Score for 'Mutagenic'";
    if (id == 0) {
        title = "Softmax Score for 'Non-Mutagenic'";
    }

    //add contents into the math displayer
    //add title
    const titleYOffset = 10;
    const titleXOffset = 50;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + titleXOffset)
        .attr("y", displayY + titleYOffset)
        .text(title)
        .attr("class", "math-displayer")
        .attr("font-size", titleYOffset)
        .attr("fill", "black");
    //add equation
    //draw fraction
    //upper part of the fraction
    const eqXOffset = titleXOffset / 2;
    const eqYOffset = titleYOffset * 2.5;
    const unitSize = eqXOffset / 3 + 3;
    const upperOffset = unitSize * 2;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + upperOffset)
        .attr("y", displayY + eqYOffset)
        .text("exp(")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX + eqXOffset + unitSize * 2.5 + upperOffset)
        .attr("y", displayY + eqYOffset - unitSize + 2)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(result[id]))
        .attr("class", "math-displayer")
        .raise();
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 2.5 + upperOffset)
        .attr("y", displayY + eqYOffset - unitSize / 3)
        .text(roundToTwo(result[id]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", "white");
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 4 + upperOffset)
        .attr("y", displayY + eqYOffset)
        .text(")")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    //upper part finished
    //draw fraction line
    const startFLPt: [number, number] = [
        displayX + eqXOffset / 2,
        displayY + eqYOffset + unitSize,
    ];
    const endFLPt: [number, number] = [
        displayX + eqXOffset + unitSize * 10,
        displayY + eqYOffset + unitSize,
    ];
    const path1 = d3
        .select(".mats")
        .append("path")
        .attr("d", d3.line()([startFLPt, endFLPt]))
        .attr("stroke", "black")
        .attr("opacity", 1)
        .attr("fill", "none")
        .attr("class", "math-displayer");
    //draw lower part
    const offsetMul = 2;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset)
        .attr("y", displayY + eqYOffset * offsetMul)
        .text("exp(")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX + eqXOffset + unitSize * 2.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize + 2)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(result[0]))
        .attr("class", "math-displayer")
        .raise();
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 2.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize / 3)
        .text(roundToTwo(result[0]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", determineColor(result[0]));
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 4)
        .attr("y", displayY + eqYOffset * offsetMul)
        .text(")+exp(")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX + eqXOffset + unitSize * 7.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize + 2)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(result[1]))
        .attr("class", "math-displayer")
        .raise();
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 7.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize / 3)
        .text(roundToTwo(result[1]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", determineColor(result[1]));
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 9)
        .attr("y", displayY + eqYOffset * offsetMul)
        .text(")")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    //lower part finished
    //eq sign and result
    d3.select(".mats")
        .append("text")
        .attr("x", endFLPt[0] + unitSize / 2)
        .attr("y", endFLPt[1])
        .text("=")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", endFLPt[0] + unitSize * 1.5)
        .attr("y", endFLPt[1] - unitSize)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(finalResult[id]))
        .attr("class", "math-displayer")
        .raise();
    let textColor = "white";
    if (Math.abs(finalResult[id]) < 0.5) {
        textColor = "black";
    }
    d3.select(".mats")
        .append("text")
        .attr("x", endFLPt[0] + unitSize * 1.5)
        .attr("y", endFLPt[1] - unitSize / 2)
        .text(roundToTwo(finalResult[id]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", textColor);
}


function determineColor(val: number) {
    if (Math.abs(val) > 0.5) {
        return "white";
    }

    return "black";
}


export function drawSoftmaxDisplayerNodeClassifier(
    displayerPos: number[],
    titles: string[],
    rectID: number,
    nthOutputVals: number[],
    nthResult: number[],
    myColor: any
) {
    //set-up the paramtere for the math displayer
    const displayW = 350;
    const displayH = 75;
    const displayX = displayerPos[0];
    const displayY = displayerPos[1];

    //add displayer
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX)
        .attr("y", displayY)
        .attr("width", displayW)
        .attr("height", displayH)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("class", "math-displayer")
        .raise();
    //add contents into the math displayer
    //add title
    const titleYOffset = 10;
    const titleXOffset = 50;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + titleXOffset)
        .attr("y", displayY + titleYOffset)
        .text(titles[Number(rectID)])
        .attr("class", "math-displayer")
        .attr("font-size", titleYOffset)
        .attr("fill", "black");
    const eqXOffset = titleXOffset / 2;
    const eqYOffset = titleYOffset * 2.5;
    const unitSize = eqXOffset / 3 + 3;
    const upperOffset = unitSize * 2;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 4 + upperOffset)
        .attr("y", displayY + eqYOffset)
        .text("exp(")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX + eqXOffset + unitSize * 6.5 + upperOffset)
        .attr("y", displayY + eqYOffset - unitSize + 2)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(nthOutputVals[Number(rectID)]))
        .attr("class", "math-displayer")
        .raise();
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 6.5 + upperOffset)
        .attr("y", displayY + eqYOffset - unitSize / 3)
        .text(roundToTwo(nthOutputVals[Number(rectID)]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", determineColor(nthOutputVals[Number(rectID)]));
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 8 + upperOffset)
        .attr("y", displayY + eqYOffset)
        .text(")")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    //draw fraction line
    const startFLPt: [number, number] = [
        displayX + eqXOffset / 2,
        displayY + eqYOffset + unitSize,
    ];
    const endFLPt: [number, number] = [
        displayX + eqXOffset + unitSize * 10,
        displayY + eqYOffset + unitSize,
    ];
    const endPathPt: [number, number] = [
        displayX + eqXOffset + unitSize * 19,
        displayY + eqYOffset + unitSize,
    ];
    const path1 = d3
        .select(".mats")
        .append("path")
        .attr("d", d3.line()([startFLPt, endPathPt]))
        .attr("stroke", "black")
        .attr("opacity", 1)
        .attr("fill", "none")
        .attr("class", "math-displayer");

    //draw lower part
    const offsetMul = 2;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset)
        .attr("y", displayY + eqYOffset * offsetMul)
        .text("exp(")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX + eqXOffset + unitSize * 2.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize + 2)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(nthOutputVals[0]))
        .attr("class", "math-displayer")
        .raise();
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 2.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize / 3)
        .text(roundToTwo(nthOutputVals[0]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", determineColor(nthOutputVals[0]));
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 4)
        .attr("y", displayY + eqYOffset * offsetMul)
        .text(")+exp(")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX + eqXOffset + unitSize * 7.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize + 2)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(nthOutputVals[1]))
        .attr("class", "math-displayer")
        .raise();
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 7.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize / 3)
        .text(roundToTwo(nthOutputVals[1]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", determineColor(nthOutputVals[1]));

    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 9)
        .attr("y", displayY + eqYOffset * offsetMul)
        .text(")+exp(")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX + eqXOffset + unitSize * 12.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize + 2)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(nthOutputVals[2]))
        .attr("class", "math-displayer")
        .raise();
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 12.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize / 3)
        .text(roundToTwo(nthOutputVals[2]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", determineColor(nthOutputVals[2]));    

    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 14)
        .attr("y", displayY + eqYOffset * offsetMul)
        .text(")+exp(")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX + eqXOffset + unitSize * 17.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize + 2)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(nthOutputVals[3]))
        .attr("class", "math-displayer")
        .raise();
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 17.5)
        .attr("y", displayY + eqYOffset * offsetMul - unitSize / 3)
        .text(roundToTwo(nthOutputVals[3]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", determineColor(nthOutputVals[3]));
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset + unitSize * 19)
        .attr("y", displayY + eqYOffset * offsetMul)
        .text(")")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");

    //lower part finished
    //eq sign and result
    d3.select(".mats")
        .append("text")
        .attr("x", endFLPt[0] + unitSize * 11)
        .attr("y", endFLPt[1])
        .text("=")
        .attr("class", "math-displayer")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("rect")
        .attr("x", endFLPt[0] + unitSize * 12)
        .attr("y", endFLPt[1] - unitSize)
        .attr("width", unitSize)
        .attr("height", unitSize)
        .style("stroke", "black")
        .attr("fill", myColor(nthResult[Number(rectID)]))
        .attr("class", "math-displayer")
        .raise();
    let textColor = "white";
    if (Math.abs(nthResult[Number(rectID)]) < 0.5) {
        textColor = "black";
    }
    d3.select(".mats")
        .append("text")
        .attr("x", endFLPt[0] + unitSize * 12)
        .attr("y", endFLPt[1] - unitSize / 2)
        .text(roundToTwo(nthResult[Number(rectID)]))
        .attr("class", "math-displayer")
        .attr("font-size", unitSize / 2)
        .attr("fill", textColor);
}

export function drawActivationExplanation(
    x: number,
    y: number,
    title: string,
    formula: string,
    description: string
) {
    const displayW = 250;
    const displayH = 75;

    //find coordination for the math displayer first
    const displayX = x + 10;
    const displayY = y - 10;

    //add displayer
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX)
        .attr("y", displayY)
        .attr("width", displayW)
        .attr("height", displayH)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("class", "math-displayer procVis")
        .raise();

    const titleYOffset = 10;
    const titleXOffset = 50;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + titleXOffset)
        .attr("y", displayY + titleYOffset)
        .text(title)
        .attr("class", "math-displayer procVis")
        .attr("font-size", titleYOffset)
        .attr("fill", "black");
    const eqXOffset = titleXOffset / 2;
    const eqYOffset = titleYOffset * 2.5;
    const unitSize = eqXOffset / 3 + 3;
    const upperOffset = unitSize * 2;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset)
        .attr("y", displayY + eqYOffset)
        .text(formula)
        .attr("class", "math-displayer procVis")
        .attr("font-size", unitSize)
        .attr("fill", "black");
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset)
        .attr("y", displayY + eqYOffset + unitSize * 1.5)
        .text(description)
        .attr("class", "math-displayer procVis")
        .attr("font-size", unitSize)
        .attr("fill", "black");
}

export function drawMatmulExplanation(
    x: number,
    y: number,
    title: string,
    description: string
) {
    const displayW = 350;
    const displayH = 50;

    //find coordination for the math displayer first
    const displayX = x + 10;
    const displayY = y - 10;

    //add displayer
    d3.select(".mats")
        .append("rect")
        .attr("x", displayX)
        .attr("y", displayY)
        .attr("width", displayW)
        .attr("height", displayH)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("class", "math-displayer procVis")
        .raise();

    const titleYOffset = 10;
    const titleXOffset = 50;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + 100)
        .attr("y", displayY + titleYOffset)
        .text(title)
        .attr("class", "math-displayer procVis")
        .attr("font-size", titleYOffset)
        .attr("fill", "black")
        .raise();
    const eqXOffset = titleXOffset / 2;
    const eqYOffset = titleYOffset * 2.5;
    const unitSize = eqXOffset / 3 + 3;
    const upperOffset = unitSize * 2;
    d3.select(".mats")
        .append("text")
        .attr("x", displayX + eqXOffset)
        .attr("y", displayY + eqYOffset)
        .text(description)
        .attr("class", "math-displayer procVis")
        .attr("font-size", unitSize)
        .attr("fill", "black")
        .raise();
}

export function graphVisDrawMatmulExplanation(svg: any, x:number, y:number, title:string, description:string){
    const displayW = 350;
    const displayH = 50;

    //find coordination for the math displayer first
    const displayX = x + 10;
    const displayY = y - 10;

    //add displayer
    svg
        .append("rect")
        .attr("x", displayX)
        .attr("y", displayY)
        .attr("width", displayW)
        .attr("height", displayH)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("class", "math-displayer procVis")
        .raise();

    const titleYOffset = 10;
    const titleXOffset = 50;
    svg
        .append("text")
        .attr("x", displayX + 100)
        .attr("y", displayY + titleYOffset)
        .text(title)
        .attr("class", "math-displayer procVis")
        .attr("font-size", titleYOffset)
        .attr("fill", "black").raise();
    const eqXOffset = titleXOffset / 2;
    const eqYOffset = titleYOffset * 2.5;
    const unitSize = eqXOffset / 3 + 3;
    const upperOffset = unitSize * 2;
    svg
        .append("text")
        .attr("x", displayX + eqXOffset)
        .attr("y", displayY + eqYOffset)
        .text(description)
        .attr("class", "math-displayer procVis")
        .attr("font-size", unitSize)
        .attr("fill", "black").raise();
}





export function drawDotProduct(
    dummy: any,
    rectID: any,
    X: number[],
    Xv: any,
    curveDir: any,
    coordFeatureVis: any,
    myColor: any
) {
    //data fetching - get the current value, aggregated vector, and weight vector

    const math = create(all, {});
    let currentVal = dummy[Number(rectID)];
    let aggregatedVector: number[] = X;
    let transposedXv = math.transpose(Xv);
    transposedXv = flipVertically(transposedXv);
    let weightVector: number[] = transposedXv[Number(rectID)];

        //first few data points for example
        const dataSamples = [
            aggregatedVector[0],
            weightVector[0],
            aggregatedVector[1],
            weightVector[1]
        ];
        let operators = ["x", "+", "  x", "          ......    = "];

        if(weightVector.length==2&&aggregatedVector.length==2){
            operators[3] = "           =";
        }

        //matmul-displayer interaction
        let displayerOffset = -150;
        if(curveDir==1)displayerOffset = 100;
        let displayerX = coordFeatureVis[0];
        let displayerY = coordFeatureVis[1] + displayerOffset + 20;

    const displayW = 300;
    const displayH = 100;

    //drawPoints(".mats", "red", [[displayerX, displayerY]])

        const tooltip = d3.select(".mats").append("g");

        tooltip
            .append("rect")
            .attr("x", displayerX)
            .attr("y", displayerY - 10)
            .attr("y", displayerY - 10)
            .attr("width", displayW)
            .attr("height", displayH)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("class", "matmul-displayer procVis")
            .lower();
        
        const titleYOffset = 5;
        const titleXOffset = 50;
        tooltip
            .append("text")
            .attr("x", displayerX + titleXOffset)
            .attr("y", displayerY + titleYOffset)
            .text("Matmul Visualization")
            .attr("class", "matmul-displayer procVis")
            .attr("font-size", titleYOffset*2)
            .attr("font-size", titleYOffset*2)
            .attr("fill", "black");
        
        const vectorLength = displayH - titleYOffset;
        
        let h = vectorLength / aggregatedVector.length;
        let h2 = vectorLength / weightVector.length;
        let w = 11.25;
        if(h>vectorLength / weightVector.length)h = vectorLength / weightVector.length;



        const eqXOffset = titleXOffset / 2;
        const eqYOffset = titleYOffset * 2.5;
        const unitSize = (eqXOffset / 3 + 3)/2;
        const upperOffset = unitSize * 2;
        tooltip
            .append("text")
            .attr("x", displayerX + 3)
            .attr("y", displayerY + vectorLength/2 + 3)
            .text("dot(")
            .attr("class", "matmul-displayer procVis")
            .attr("font-size", titleYOffset*2)
            .attr("font-size", titleYOffset*2)
            .attr("fill", "black");

        tooltip
            .append("text")
            .attr("x", displayerX + 3 + eqXOffset/2 + vectorLength)
            .attr("y", displayerY + vectorLength/2 + 3)
            .text(",")
            .attr("class", "matmul-displayer procVis")
            .attr("font-size", titleYOffset*2)
            .attr("font-size", titleYOffset*2)
            .attr("fill", "black");
        
        tooltip
            .append("text")
            .attr("x", displayerX + 3 + eqXOffset/2 + vectorLength + vectorLength/1.5)
            .attr("y", displayerY + vectorLength/2 + 3)
            .text(")")
            .attr("class", "matmul-displayer procVis")
            .attr("font-size", titleYOffset*2)
            .attr("font-size", titleYOffset*2)
            .attr("fill", "black");

        tooltip
            .append("text")
            .attr("x", displayerX + 3)
            .attr("y", displayerY + vectorLength/2 + 20)
            .text("=")
            .attr("class", "matmul-displayer procVis")
            .attr("font-size", titleYOffset*2)
            .attr("font-size", titleYOffset*2)
            .attr("fill", "black");

        for(let i=0; i<dataSamples.length; i++){
            tooltip
                .append("rect")
                .attr("x", displayerX + 3 + unitSize*(i+1)+30*i)
                .attr("y", displayerY + vectorLength/2 + 20 - unitSize)
                .attr("width", unitSize*2.5)
                .attr("height", unitSize*2.5)
                .style("stroke", "black")
                .attr("fill", myColor(dataSamples[i]))
                .attr("class", "matmul-displayer procVis")
                .raise();
            let color = "white";
            if(dataSamples[i]<0.5){color = "black"}
            tooltip
                .append("text")
                .attr("x", displayerX + 3 + unitSize*(i+1)+30*i + unitSize/2)
                .attr("y", displayerY + vectorLength/2 + 20 + unitSize/2)
                .text(roundToTwo(dataSamples[i]))
                .attr("class", "matmul-displayer procVis")
                .attr("font-size", unitSize)
                .attr("font-size", unitSize)
                .attr("fill", color);
        }

        

        for(let i=0; i<operators.length; i++){
            const text = tooltip
            .append("text").attr("xml:space", "preserve")
            .attr("x", displayerX + 3 + unitSize*(i+1) + 25*(i+1))
            .attr("y", displayerY + vectorLength/2 + 20 )
            .text(operators[i])
            .attr("font-size", unitSize*1.25)
            .attr("class", "matmul-displayer procVis")
            .raise();
            if(i==operators.length-1){
                text.style("font-weight", "bold");
            }
    }

        tooltip
            .append("rect")
            .attr("x", displayerX + 3 + eqXOffset/2 + vectorLength + vectorLength/1.5)
            .attr("y", displayerY + vectorLength/2 + 20 - unitSize)
            .attr("width", unitSize*2.5)
            .attr("height", unitSize*2.5)
            .style("stroke", "black")
            .attr("fill", myColor(currentVal))
            .attr("class", "matmul-displayer procVis")
            .raise();
        
            let color = "white";
            if(currentVal<0.5){color = "black"}
            tooltip
                .append("text")
                .attr("x", displayerX + 3 + eqXOffset/2 + vectorLength + vectorLength/1.5 + unitSize/2)
                .attr("y", displayerY + vectorLength/2 + 20 + unitSize/2)
                .text(roundToTwo(currentVal))
                .attr("class", "matmul-displayer procVis")
                .attr("font-size", unitSize)
                .attr("font-size", unitSize)
                .attr("fill", color);
        
        
        //draw the aggregated vector
        for(let i=0; i<aggregatedVector.length; i++){
            tooltip
                .append("rect")
                .attr("x", displayerX + eqXOffset+i*h/2)
                .attr("y", displayerY + vectorLength/2)
                .attr("width", h/2)
                .attr("height", w/2)
                .attr("fill", myColor(aggregatedVector[i]))
                .attr("class", "procVis matmul-displayer").raise();
        }

        //draw the weight vector
        for(let i=0; i<weightVector.length; i++){
            tooltip
                .append("rect")
                .attr("x", displayerX + eqXOffset * 5)
                .attr("x", displayerX + eqXOffset * 5)
                .attr("y", displayerY + eqYOffset + i*h2/2)
                .attr("width", w/2)
                .attr("height", h2/2)
                .attr("fill", myColor(weightVector[i]))
                .attr("class", "procVis matmul-displayer").raise();
        }

        //draw franes
        tooltip
            .append("rect")
            .attr("x", displayerX + eqXOffset)
            .attr("y", displayerY + vectorLength/2)
            .attr("width", h/2 * aggregatedVector.length)
            .attr("height", w/2)
            .attr("fill", "none")
            .attr("class", "procVis matmul-displayer")
            .attr("stroke", "black")
            .raise();

            tooltip
            .append("rect")
            .attr("x", displayerX + eqXOffset * 5)
            .attr("x", displayerX + eqXOffset * 5)
            .attr("y", displayerY + eqYOffset)
            .attr("width", w/2)
            .attr("height", h2/2 * weightVector.length)
            .attr("fill", "none")
            .attr("class", "procVis matmul-displayer")
            .attr("stroke", "black")
            .raise();

           // 定义缩放比例
const scaleFactor = 1.5;

// 获取 tooltip 元素的边界框
const bbox = tooltip.node()?.getBBox();

// 计算中心点
if(bbox!=undefined){
const centerX = bbox.x + bbox.width / 2;
const centerY = bbox.y + bbox.height / 2;

// 将缩放中心设置为元素的中心点
tooltip.attr('transform', `translate(${centerX}, ${centerY}) scale(${scaleFactor}) translate(${-centerX}, ${-centerY})`);

}

}
