var ARR_SIZE = 250;
var CANVAS_W = 2560;
var CANVAS_H = 1080;
var MAX = CANVAS_H - 10;
var SLEEP = 50;

var sorter;
var arr;
var t0;
var states = [];

function random_int(max) { 
    return Math.floor(Math.random() * max);
}

function random_array(sizef) {
    for (var a = [], i = 0; i < ARR_SIZE; i++) {
        a[i] = random_int(sizef);
        states[i] = -1;
    }
    return a;
}

function setup() {
    // put setup code here
    createCanvas(CANVAS_W, CANVAS_H);
    arr = random_array(MAX);
    //frameRate(5);
    //sorter = insertionSort();
    sorter = quick_sort(arr);
    //quick_sort(arr, 0, ARR_SIZE);
    t0 = performance.now();
}

function draw() {
    // put drawing code here
    background(0);
    line_w = CANVAS_W / ARR_SIZE;
    //console.log(arr);
    if (ARR_SIZE <= 250)
        stroke(0);
    else {
        stroke(255);
    }
    
    for (var i = 0; i < ARR_SIZE; i++) {
        if (states[i] == 0) {
            stroke(0);
            fill(0, 255, 0); // fill green
        } else if (states[i] == 1) {
            stroke(0);
            fill(255, 0, 0); // fill red
        } else {
            stroke(255);
            fill(255); // fill white
        }
            //ellipse(i * line_w, CANVAS_H - arr[i], line_w);
            rect(i * line_w, CANVAS_H - arr[i], line_w, arr[i]);
    }

    // generator function calling next()
    // if (sorter.next().done)
    // {
    //     for (var i = 0; i < ARR_SIZE; i++) {
    //         rect(i * line_w, CANVAS_H - arr[i], line_w, arr[i]);
    //     }
    //     var time = round(performance.now() - t0) / 1000;
    //     console.log('Sorted ' + ARR_SIZE + ' items in ' + time + 's');
    //     noLoop();
    // }
}

async function partition(arr, start, end) {

    for (var i = start; i < end; i++) {
        states[i] = 1;
    }

    var pivot_val = arr[end];
    var pivot_index = start;
    states[pivot_index] = 0;
    for (var i = start; i < end; i++)
    {
        if (arr[i] < pivot_val)
        {
            // swapping elements
            await swap(arr, i, pivot_index);
            // move to next element
            states[pivot_index] = -1;
            pivot_index++;
            states[pivot_index] = 0;
        }
    }

    await swap(arr, pivot_index, end);
    for (var i = start; i < end; i++) {
        if (i != pivot_index) {
            states[i] = -1;
        }
    }
    return pivot_index;
}

async function quick_sort(arr, start, end) {
    if (start >= end) {
        return;
    }

    var index = await partition(arr, start, end);
    states[index] = -1;

    await Promise.all([
        quick_sort(arr, start, index-1),
        quick_sort(arr, index+1, end)
    ]);
}

async function swap(arr, a, b) {
    await sleep(SLEEP);
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}
beep();

async function insertionSort() 
{ 
    let i, key, j; 
    for (i = 1; i < ARR_SIZE; i++)
    { 
        key = arr[i]; 
        states[i] = 1;
        j = i - 1; 
   
        /* Move elements of arr[0..i-1], that are 
        greater than key, to one position ahead 
        of their current position */
        while (j >= 0 && arr[j] > key)
        { 
            arr[j + 1] = arr[j]; 
            j = j - 1;
            states[j] = 0;
        } 
        arr[j + 1] = key; 
        await sleep(SLEEP);
        states[i] = 0;
    }
} 

// iterative quick sort
// function* quick_sort(arr) {
//     // Creating an array that we'll use as a stack, using the push() and pop() functions
//     stack = [];
    
//     // Adding the entire initial array as an "unsorted subarray"
//     stack.push(0);
//     stack.push(arr.length - 1);
    
//     // There isn't an explicit peek() function
//     // The loop repeats as long as we have unsorted subarrays
//     while(stack[stack.length - 1] >= 0){
        
//         // Extracting the top unsorted subarray
//     	end = stack.pop();
//         start = stack.pop();
        
//         pivotIndex = partition(arr, start, end);
//         // If there are unsorted elements to the "left" of the pivot,
//         // we add that subarray to the stack so we can sort it later
//         if (pivotIndex - 1 > start){
//         	stack.push(start);
//             stack.push(pivotIndex - 1);
//             yield;
// 		}
        
//         // If there are unsorted elements to the "right" of the pivot,
//         // we add that subarray to the stack so we can sort it later
//         if (pivotIndex + 1 < end){
//         	stack.push(pivotIndex + 1);
//             stack.push(end);
//             yield;
//         }
//     }
// }

