/*/////////////////////////////////////////////
               DECLARE  VARIABLES
/////////////////////////////////////////////*/
let array = [];
let arraySize = Number($('#array_range').val());
let customInputvalues = $("#enter_values_input").val();
let sortType;
let sortingSpeedMax = $('#sorting_speed').attr('max')
let bubbleSorted = false;
let allTrue = true;
let sorting = false;
let time = sortingSpeedMax - $("#sorting_speed").val();
let staticColor = "#5959ad";
let checkingColor = "orange";
let wrongColor = "crimson";
let allCorrectColor = "green";
let correctedColor = "yellowgreen";
let array_max_number_limit = 181;
let array_min_number_limit = 20;
let dom_item_height_multiplier = 90 / ( array_max_number_limit + 20 )
let stopSorting = true

/*/////////////////////////////////////////////
               DECLARE  FUNCTIONS
/////////////////////////////////////////////*/

let timer = ms => new Promise(res => setTimeout(res, ms))  // Timer that indicates the await time

function createArray() {
    let theme_class = $('body').attr('class');

    for (let i = arraySize; i > 0; i--){
        let rndNum = Math.floor(Math.random() * array_max_number_limit) + array_min_number_limit; // Generates random numbers in this range [20; 500]
        let visualArrayItem = '';
        array.push(rndNum);
        if (arraySize <= 30) {
            visualArrayItem += `<div class="visual_array_item ${theme_class}" id="item_${i}">${rndNum}</div>`;
        } else {
            visualArrayItem += `<div class="visual_array_item ${theme_class}" id="item_${i}"></div>`;
        }
        $('#sorting_array_container').append(visualArrayItem);
        definingItemsHeight(i, rndNum)
        visualArrayItem = ""
    };

    definingItemsWidth();
};

function createArrayFromCustomValues() {
    let theme_class = $('body').attr('class');
    let arr = customInputvalues.trim().split(",").map(Number);
    array = arr
    arraySize = arr.length;

    for (let i in arr) {
        if (isNaN(arr[i]) || arr[i] == "") {
            alert("Please enter valid values (numbers separated by comma)")
            arraySize = Number($("#array_range").val());
            removeArray();
            createArray();
            return
        }
        if (arr[i] > 181) {
            alert("Please enter valid values (numbers must not exceed 180)");
            arraySize = Number($("#array_range").val());
            removeArray();
            createArray();
            return;
        }
        if (arraySize < 4) {
            alert("Please enter more than 3 item");
            arraySize = Number($("#array_range").val());
            removeArray();
            createArray();
            return;
        }
        let visualArrayItem = '';
        if (arraySize <= 30) {
            visualArrayItem += `<div class="visual_array_item ${theme_class}" id="item_${i}">${arr[i]}</div>`;
        } else {
            visualArrayItem += `<div class="visual_array_item ${theme_class}" id="item_${i}"></div>`;
        }
        $('#sorting_array_container').append(visualArrayItem);
        definingItemsHeight(i, Number(arr[i]))
        visualArrayItem = ""
    };

    definingItemsWidth();
};

function definingItemsWidth() {
    let singleItemWidth = 100 / arraySize + "%";
    $('.visual_array_item').css({ 'width': singleItemWidth, })
}

function definingItemsHeight(index, randNum) {
    let singleItemHeight = dom_item_height_multiplier * + randNum + "%";
    $(`#item_${index}`).css({ "height": singleItemHeight })
}

function removeArray() {
    array = [];
    visualArrayItem = '';
    $('.visual_array_item').remove();
    $('#array_range').attr("disabled", false);
    sorting = false;
    stopSorting = true
}

function arraySizeChanged() {
    arraySize = Number($('#array_range').val());
    if (arraySize > 0 && arraySize < 20) {
        $('.visual_array_item').css({ 'transition': '.2s' })
    } else if (arraySize > 20) {
        $('.visual_array_item').css({ 'transition': 0 })
    }
};

function getValueOfSortSelect() {
    sortType = $('#sorting_algorithm_select').val();
}

function arraySortingSpeedChanged() {
    time = sortingSpeedMax - Number($('#sorting_speed').val());
}

function itemColoringForBubbleSort(index, color, color_2, DOM) {
    $(DOM[index]).css({ "backgroundColor": color });
    $(DOM[index + 1]).css({ "backgroundColor": color_2 });
}

function itemColoringForMergeSort(id1, id2, color, color_2, DOM) {
    $(`#${id1}`).css({"backgroundColor": color });
    $(`#${id2}`).css({"backgroundColor": color_2 });
}

function itemColoringForHeapSort(index, index2, color, color_2, DOM) {
    $(DOM[index]).css({ "backgroundColor": color });
    $(DOM[index2]).css({ "backgroundColor": color_2 });
}

function itemColoringForSelectionSort(index, color, DOM) {
    $(DOM[index]).css({ "backgroundColor": color });
}

function itemColoringForInsertionSort(index, index2, color, color_2, DOM) {
    $(DOM[index]).css({ "backgroundColor": color });
    $(DOM[index2]).css({ "backgroundColor": color_2 });
}


// function itemDetachAndAttachForMerge(id1, id2, DOM) {
//     let detachedElem = $(DOM[index]).detach();
//     $(detachedElem).insertAfter($(DOM[index2]));
// }

function itemDetachAndAttach(index, index2, DOM) {
    let detachedElem = $(DOM[index]).detach();
    $(detachedElem).insertAfter($(DOM[index2]));
}

jQuery.fn.swapWith = function(to) {
    return this.each(function() {
        var copy_to = $(to).clone(true);
        var copy_from = $(this).clone(true);
        $(to).replaceWith(copy_from);
        $(this).replaceWith(copy_to);
    });
};

function itemDetachAndAttachForHeap(index, index2, DOM) {
    $(DOM[index]).swapWith($(DOM[index2]));
}

function itemDetachAndAttachForSelection(index, index2, DOM) {
    $(DOM[index]).swapWith($(DOM[index2]));
}

function Sort() {
    if (sorting) return
    stopSorting = false
    $('#array_range').attr("disabled", true);
    sorting = true;
    getValueOfSortSelect();
    arraySizeChanged();
    if (sortType === "bubble") {
        bubbleSort();
    } else if (sortType === "merge") {
        console.log(mergeSort(array));
    } else if (sortType === "heap") {
        heapSort();
    } else if (sortType === "quick") {
        quickSort();
    } else if (sortType === "selection") {
        selectionSort();
    } else if (sortType === "insertion") {
        insertionSort();
    } else if (sortType === "radix") {
        radixSort();
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// BUBBLE SORT  /////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**/async function bubbleSort() {
/**/    let domElements = $('.visual_array_item');
/**/    let sortedCount = 1;
/**/
/**/    while (!bubbleSorted) {
/**/        for (let i = 0; i < array.length - sortedCount; i++) {
/**/            if (stopSorting) return
/**/
/**/            itemColoringForBubbleSort(i, checkingColor, checkingColor, domElements) // Coloring items in array that are being checked
/**/            await timer(time);
/**/
/**/            if (array[i] > array[i + 1]) {
/**/                itemColoringForBubbleSort(i, wrongColor, wrongColor, domElements) // Coloring items in array that were wrong placed
/**/                await timer(time);
/**/
/**/                itemDetachAndAttach(i, i + 1, domElements)
/**/                domElements = $('.visual_array_item'); // Reassigning dom elements array to match dom
/**/                await timer(time);
/**/
/**/                itemColoringForBubbleSort(i, correctedColor, correctedColor, domElements) // Coloring items in array that were fixed and placed correctly
/**/                await timer(time);
/**/
/**/                allTrue = false;
/**/                let arrItem = array[i + 1]; // Changing array items correspondingly
/**/                array[i + 1] = array[i];
/**/                array[i] = arrItem
/**/
/**/            } else {
/**/                itemColoringForBubbleSort(i, correctedColor, correctedColor, domElements) // Coloring items in array that were already placed correctly
/**/                await timer(time);
/**/            }
/**/
/**/            //Checking if the biggest item is at the end and coloring
/**/            if (i == array.length - sortedCount - 1) {
/**/                itemColoringForBubbleSort(i, staticColor, allCorrectColor, domElements) // Coloring item in array that was placed at the end
/**/                await timer(time);
/**/            } else {
/**/                itemColoringForBubbleSort(i, staticColor, staticColor, domElements) // Coloring items in array that were already checked and placed correctyl
/**/                await timer(time);
/**/            }
/**/            
/**/        }
/**/        if (allTrue) {
/**/            bubbleSorted = true;
/**/        }
/**/        allTrue = true;
/**/        sortedCount++
/**/    }
/**/
/**/    sortedCount = 1;
/**/    $('.visual_array_item').css({ "backgroundColor": allCorrectColor })
/**/    bubbleSorted = false;
/**/    sorting = false;
/**/    $('#array_range').attr("disabled", false);
/**/}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// BUBBLE SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/












/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// MERGE SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
function merge(arr_left, arr_right, visual_arr_left, visual_arr_right, domElements) {
    let l_i = 0;
    let r_i = 0;
    let sortedArray = [];

    while (l_i < arr_left.length && r_i < arr_right.length) {
        let leftEl = arr_left[l_i];
        let rightEl = arr_right[r_i];
        let leftElVisID = $(visual_arr_left[l_i]).attr('id');
        let righElVisID = $(visual_arr_right[r_i]).attr('id');

        if (leftEl < rightEl) {correctedColor
            sortedArray.push(leftEl)
            l_i++;
        } else {
            sortedArray.push(rightEl)
            r_i++;
        }
    }

    while (arr_left.length) {
        sortedArray.push(arr_left.shift(arr_left[0]))
    }

    while (arr_right.length) {
        sortedArray.push(arr_right.shift(arr_right[0]))
    }


    return [...sortedArray]
}

function mergeSort(array) {
    if (array.length <= 1) {
        return array;
    }

    let domElements = $('.visual_array_item');
    let len = array.length;
    let middleItemIndex = Math.floor(len / 2);
    let arr_left = array.slice(0, middleItemIndex);
    let arr_right = array.slice(middleItemIndex);
    let visual_arr_left = domElements.slice(0, middleItemIndex);
    let visual_arr_right = domElements.slice(middleItemIndex);

    return merge(mergeSort(arr_left), mergeSort(arr_right), visual_arr_left, visual_arr_right, domElements)
}
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// MERGE SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/








/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// HEAP SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/**/
/**/async function heapSort() {
/**/    let domElements = $(".visual_array_item");
/**/    let arrayLength = array.length;
/**/
/**/    while (arrayLength >= 2) { // Looping Till we are left with 2 items in heapifying array
/**/        for (let i = Math.floor(arrayLength / 2 - 1); i >= 0; i--) { // Lopping till
/**/            let parentNode = array[i];
/**/            let leftChildNode = array[2 * i + 1] ? 2 * i + 1 == arrayLength ? 0 : array[2 * i + 1]  : 0;
/**/            let rightChildNode = array[2 * i + 2] ? 2 * i + 2 == arrayLength ? 0 : array[2 * i + 2] : 0;
/**/            
/**/            $(domElements[i]).css({ "backgroundColor": checkingColor });
/**/            $(domElements[2 * i + 1]).css({ "backgroundColor": checkingColor });
/**/            if (2 * i + 2 !== arrayLength) {
/**/                $(domElements[2 * i + 2]).css({ "backgroundColor": checkingColor });
/**/                await timer(time);
/**/            }
/**/            
/**/            if (leftChildNode > rightChildNode && leftChildNode > parentNode) {
/**/                $(domElements[i]).css({ "backgroundColor": staticColor });
/**/                $(domElements[2 * i + 1]).css({ "backgroundColor": staticColor });
/**/                if (2 * i + 2 !== arrayLength) {
/**/                    $(domElements[2 * i + 2]).css({ "backgroundColor": staticColor });
/**/                    await timer(time);
/**/                }
/**/                itemColoringForHeapSort(i, 2 * i + 1, wrongColor, wrongColor, domElements);
/**/                await timer(time);
/**/                itemDetachAndAttachForHeap(i, 2 * i + 1, domElements);
/**/                domElements = $(".visual_array_item");
/**/                await timer(time);
/**/                itemColoringForHeapSort(i, 2 * i + 1, correctedColor, correctedColor, domElements);
/**/                await timer(time);
/**/                itemColoringForHeapSort(i, 2 * i + 1, staticColor, staticColor, domElements);
/**/                await timer(time);
/**/                let arrItem = array[2 * i + 1]; // Changing array items correspondingly
/**/                array[2 * i + 1] = array[i];
/**/                array[i] = arrItem;
/**/            } else if (rightChildNode >= leftChildNode && rightChildNode > parentNode) {
/**/                $(domElements[i]).css({ "backgroundColor": staticColor });
/**/                $(domElements[2 * i + 1]).css({ "backgroundColor": staticColor });
/**/                if (2 * i + 2 !== arrayLength) {
/**/                    $(domElements[2 * i + 2]).css({ "backgroundColor": staticColor });
/**/                    await timer(time);
/**/                }
/**/                itemColoringForHeapSort(i, 2 * i + 2, wrongColor, wrongColor, domElements);
/**/                await timer(time);
/**/                itemDetachAndAttachForHeap(i, 2 * i + 2, domElements);
/**/                domElements = $(".visual_array_item");
/**/                await timer(time);
/**/                itemColoringForHeapSort(i, 2 * i + 2, correctedColor, correctedColor, domElements);
/**/                await timer(time);
/**/                itemColoringForHeapSort(i, 2 * i + 2, staticColor, staticColor, domElements);
/**/                await timer(time);
/**/                let arrItem = array[2 * i + 2]; // Changing array items correspondingly
/**/                array[2 * i + 2] = array[i];
/**/                array[i] = arrItem;
/**/            } else {
/**/                $(domElements[i]).css({ "backgroundColor": correctedColor });
/**/                $(domElements[2 * i + 1]).css({ "backgroundColor": correctedColor });
/**/                if (2 * i + 2 !== arrayLength) {
/**/                    $(domElements[2 * i + 2]).css({ "backgroundColor": correctedColor });
/**/                    await timer(time);
/**/                }
/**/                $(domElements[i]).css({ "backgroundColor": staticColor });
/**/                $(domElements[2 * i + 1]).css({ "backgroundColor": staticColor });
/**/                if (2 * i + 2 !== arrayLength) {
/**/                    $(domElements[2 * i + 2]).css({ "backgroundColor": staticColor });
/**/                    await timer(time);
/**/                }
/**/            }
/**/        }
/**/        itemColoringForHeapSort(0, arrayLength - 1, wrongColor, wrongColor, domElements);
/**/        await timer(time);
/**/        itemDetachAndAttachForHeap(0, arrayLength - 1, domElements);
/**/        domElements = $(".visual_array_item");
/**/        await timer(time);
/**/        itemColoringForHeapSort(0, arrayLength - 1, correctedColor, correctedColor, domElements);
/**/        await timer(time);
/**/        if (arrayLength == 2) {
/**/            itemColoringForHeapSort(0, arrayLength - 1, allCorrectColor, allCorrectColor, domElements);
/**/            await timer(time);
/**/        } else {
/**/            itemColoringForHeapSort(0, arrayLength - 1, staticColor, allCorrectColor, domElements);
/**/            await timer(time);
/**/        }
/**/        let heapMax = array[0];
/**/        array[0] = array[arrayLength - 1];
/**/        array[arrayLength - 1] = heapMax;
/**/        arrayLength--;
/**/    }
/**/    
/**/    sorting = false;
/**/    $("#array_range").attr("disabled", false);
/**/}
/**/
/**/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// HEAP SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/











/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// QUICK SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
async function quickSort() {

}
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// QUICK SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/














/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// SELECTION SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
async function selectionSort() {
    let shouldSwapIndex = 0;
    let currentRunMinimumIndex = 0
    let domElements = $(".visual_array_item");

    while(shouldSwapIndex != arraySize){
        $(domElements[shouldSwapIndex]).css({ "backgroundColor": checkingColor });

        for(let i = shouldSwapIndex + 1; i < arraySize; i++){
            itemColoringForSelectionSort(i, checkingColor, domElements);
            await timer(time);

            if(array[i] < array[currentRunMinimumIndex]){
                if(currentRunMinimumIndex !== shouldSwapIndex){
                    itemColoringForSelectionSort(currentRunMinimumIndex, staticColor, domElements);
                }
                currentRunMinimumIndex = i
                itemColoringForSelectionSort(currentRunMinimumIndex, checkingColor, domElements);
                await timer(time);
            }else{
                itemColoringForSelectionSort(i, correctedColor, domElements);
                await timer(time);
                itemColoringForSelectionSort(i, staticColor, domElements);
                await timer(time);
            }
        }

        itemColoringForSelectionSort(shouldSwapIndex, wrongColor, domElements);
        itemColoringForSelectionSort(currentRunMinimumIndex, wrongColor, domElements);
        await timer(time);

        itemDetachAndAttachForSelection(shouldSwapIndex, currentRunMinimumIndex, domElements)
        domElements = $(".visual_array_item");
        await timer(time);

        itemColoringForSelectionSort(shouldSwapIndex, correctedColor, domElements);
        itemColoringForSelectionSort(currentRunMinimumIndex, correctedColor, domElements);
        await timer(time);

        itemColoringForSelectionSort(currentRunMinimumIndex, staticColor, domElements);
        itemColoringForSelectionSort(shouldSwapIndex, allCorrectColor, domElements);
        await timer(time);

        let arrItem = array[currentRunMinimumIndex]
        array[currentRunMinimumIndex] = array[shouldSwapIndex]
        array[shouldSwapIndex] = arrItem

        shouldSwapIndex++;
        currentRunMinimumIndex = shouldSwapIndex
    }

    sorting = false;
    $("#array_range").attr("disabled", false);
}
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// SELECTION SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/















/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// INSERTION SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
async function insertionSort() {
    let domElements = $(".visual_array_item");

    for(let i = 1; i < arraySize; i++){
        let currentTarget = i;
        itemColoringForInsertionSort(currentTarget - 1, currentTarget, checkingColor, checkingColor, domElements);
        await timer(time);
        if(array[currentTarget] < array[currentTarget - 1]){
            while(array[currentTarget] < array[currentTarget - 1]){
                itemColoringForInsertionSort(currentTarget - 1, currentTarget, wrongColor, wrongColor, domElements);
                await timer(time);
                itemDetachAndAttach(currentTarget - 1, currentTarget, domElements);
                domElements = $(".visual_array_item");
                await timer(time);
                itemColoringForInsertionSort(currentTarget - 1, currentTarget, correctedColor, correctedColor, domElements);
                await timer(time);
                itemColoringForInsertionSort(currentTarget - 1, currentTarget, staticColor, staticColor, domElements);
                await timer(time);
                let arrItem = array[currentTarget];
                array[currentTarget] = array[currentTarget - 1];
                array[currentTarget - 1] = arrItem
                currentTarget--;
            }
        }else{
            itemColoringForInsertionSort(currentTarget - 1, currentTarget, correctedColor, correctedColor, domElements);
            await timer(time);
            itemColoringForInsertionSort(currentTarget - 1, currentTarget, staticColor, staticColor, domElements);
            await timer(time);  
        }
    }

    $(domElements).css("backgroundColor", allCorrectColor)

    sorting = false;
    $("#array_range").attr("disabled", false);
}
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// INSERTION SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/



/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// RADIX SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
async function radixSort() {

}
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// RADIX SORT  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/




function changeTheme(theme) {
    $('.theme_1').removeClass('theme_1')
    $('.theme_2').removeClass('theme_2')
    $('.theme_3').removeClass('theme_3')
    $('.theme_4').removeClass('theme_4')

    $('body').addClass(theme);
    $('header').addClass(theme);
    $('#generate_new_array').addClass(theme);
    $('#change_array_size_and_speed').addClass(theme);
    $('#sorting_algorithms').addClass(theme);
    $('#sorting_algorithm_select').addClass(theme);
    $('#start_sort').addClass(theme);
    $('#sorting_array_section').addClass(theme);
    $('#sorting_array_container').addClass(theme);
    $('footer').addClass(theme);
    $('.visual_array_item').addClass(theme);

    if (theme == "theme_1") {
        staticColor = "white";
        checkingColor = "lightgrey";
        wrongColor = "darkgrey";
        allCorrectColor = "green";
        correctedColor = "yellowgreen";
    } else if (theme == "theme_2") {
        staticColor = "#5959ad";
        checkingColor = "orange";
        wrongColor = "crimson";
        allCorrectColor = "green";
        correctedColor = "yellowgreen";
    } else if (theme == "theme_3") {
        staticColor = "#5959ad";
        checkingColor = "orange";
        wrongColor = "crimson";
        allCorrectColor = "green";
        correctedColor = "yellowgreen";
    } else if (theme == "theme_4") {
        staticColor = "#5959ad";
        checkingColor = "orange";
        wrongColor = "crimson";
        allCorrectColor = "green";
        correctedColor = "yellowgreen";
    }
}

/*//////////////////////////////////////////////
               CALLING FUNCTIONS
//////////////////////////////////////////////*/

createArray();

$(document).on('input', '#array_range', function () {
    arraySizeChanged();
    removeArray();
    createArray();
});

$(document).on('keypress', '#enter_values_input', function (e) {
    if (e.key == "Enter") {
        removeArray();
        customInputvalues = $("#enter_values_input").val();
        createArrayFromCustomValues();
    }
});

$(document).on('input', '#sorting_speed', function () {
    arraySortingSpeedChanged();
});

$('#generate_new_array').on('click', () => {
    if(!sorting){
        removeArray();
        createArray();
    }
})

$("#start_sort").on('click', Sort)

$('.themes').on('click', e => {
    let theme = $(e.currentTarget).attr("id");
    changeTheme(theme);
})