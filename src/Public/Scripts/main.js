/*/////////////////////////////////////////////
               DECLARE  VARIABLES
/////////////////////////////////////////////*/
let array = [];
let arraySize = Number($('#array_range').val());
let visualArrayItem = '';
let singleItemWidth, singleItemHeight;
let sortType;
let bubbleSorted = false;
let allTrue = true;
const staticColor = "#5959ad";
const checkingColor = "orange";
const wrongColor = "crimson";
const allCorrectColor = "green";
const correctedColor = "yellowgreen";
let sorting = false;
let timer = ms => new Promise(res => setTimeout(res, ms))
let time;


/*/////////////////////////////////////////////
               DECLARE  FUNCTIONS
/////////////////////////////////////////////*/

function createArray() {
    for (let i = arraySize; i > 0; i--){
        let rndNum = Math.floor(Math.random() * 500) + 20;
        array.push(rndNum);
        if (arraySize <= 30) {
            visualArrayItem += `<div class="visual_array_item" id="item_${i}">${rndNum}</div>`;
        } else {
            visualArrayItem += `<div class="visual_array_item" id="item_${i}"></div>`;
        }
        $('#sorting_array_container').append(visualArrayItem);
        singleItemHeight = 0.17 * + rndNum + "%";
        $(`#item_${i}`).css({ "height": singleItemHeight})
        visualArrayItem = ""
    };
    
    singleItemWidth = 100 / arraySize + "%";
    $('.visual_array_item').css({
        'width': singleItemWidth,
    })
};

function removeArray() {
    array = [];
    visualArrayItem = '';
    $('.visual_array_item').remove();
    sorting = false;
}

function arraySizeChanged() {
    arraySize = Number($('#array_range').val());
    time = (100 - $('#array_range').val()) * 100;
    if (arraySize > 0 && arraySize < 20) {
        $('.visual_array_item').css({ 'transition': '.2s' })
        time = 200
    } else if (arraySize >= 0 && arraySize <= 70) {
        time = 50
        $('.visual_array_item').css({ 'transition': 0 })
    } else if (arraySize > 70 && arraySize <= 100) {
        time = 20
        $('.visual_array_item').css({ 'transition': 0 })
    }else if (arraySize > 100 && arraySize <= 150) {
        $('.visual_array_item').css({ 'transition': 0 })
        time = 2
    } else if (arraySize > 150 && arraySize <= 200) {
        $('.visual_array_item').css({ 'transition': 0 })
        time = 1
    }
};

function getValueOfSortSelect() {
    sortType = $('#sorting_algorithm_select').val();
}

function Sort() {
    if (sorting) return
    $('#array_range').attr("disabled", true);
    sorting = true;
    getValueOfSortSelect();
    arraySizeChanged();
    if (sortType === "bubble") {
        bubbleSort();
    } else if (sortType === "merge") {
        mergeSort();
    } else if (sortType === "heap") {
        heapSort();
    } else if (sortType === "quick") {
        quickSort();
    }

}

function bubbleSort() {
    let domElements = $('.visual_array_item');
    let sortedCount = 1;

    while (!bubbleSorted) {
        for (let i = 0; i < array.length - sortedCount; i++) {
            if (array[i] > array[i + 1]) {
                let detachedElem = $(domElements[i]).detach();
                $(detachedElem).insertAfter($(domElements[i+1]));
                domElements = $('.visual_array_item');
                allTrue = false;
                let arrItem = array[i + 1];
                array[i + 1] = array[i];
                array[i] = arrItem
            }
        }
        if (allTrue) {
            bubbleSorted = true;
        }
        allTrue = true;
        sortedCount++
    }

    sortedCount = 1;
    $('.visual_array_item').css({ "backgroundColor": allCorrectColor })
    bubbleSorted = false;
}


async function bubbleSort() {
    let domElements = $('.visual_array_item');
    let sortedCount = 1;

    while (!bubbleSorted) {
        for (let i = 0; i < array.length - sortedCount; i++) {
            $(domElements[i]).css({ "backgroundColor": checkingColor });
            $(domElements[i + 1]).css({ "backgroundColor": checkingColor });
            await timer(time);

            if (array[i] > array[i + 1]) {
                $(domElements[i]).css({ "backgroundColor": wrongColor });
                $(domElements[i + 1]).css({ "backgroundColor": wrongColor });
                await timer(time);

                let detachedElem = $(domElements[i]).detach();
                $(detachedElem).insertAfter($(domElements[i + 1]));
                domElements = $('.visual_array_item');
                await timer(time);
                $(domElements[i]).css({ "backgroundColor": correctedColor });
                $(domElements[i + 1]).css({ "backgroundColor": correctedColor });
                await timer(time);
                allTrue = false;
                let arrItem = array[i + 1];
                array[i + 1] = array[i];
                array[i] = arrItem

            } else {
                $(domElements[i]).css({ "backgroundColor": correctedColor });
                $(domElements[i + 1]).css({ "backgroundColor": correctedColor });
                await timer(time);
            }

            if (i == array.length - sortedCount - 1) {
                $(domElements[i]).css({ "backgroundColor": staticColor });
                $(domElements[i + 1]).css({ "backgroundColor": allCorrectColor });
                await timer(time);
            } else {
                $(domElements[i]).css({ "backgroundColor": staticColor });
                $(domElements[i + 1]).css({ "backgroundColor": staticColor });
                await timer(time);
            }
            
        }
        if (allTrue) {
            bubbleSorted = true;
        }
        allTrue = true;
        sortedCount++
    }

    sortedCount = 1;
    $('.visual_array_item').css({ "backgroundColor": allCorrectColor })
    bubbleSorted = false;
    sorting = false;
    $('#array_range').attr("disabled", false);

}

function mergeSort() {
    console.log('mergeSort')
}

function heapSort() {
    console.log('heapSort')
}

function quickSort() {
    console.log('quickSort')
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

$('#generate_new_array').on('click', () => {
    if (sorting) return
    removeArray();
    createArray();
})

$("#start_sort").on('click', Sort)