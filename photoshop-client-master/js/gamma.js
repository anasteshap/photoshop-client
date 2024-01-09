// function chooseConvertGamma() {
//     let selectElement = document.querySelector('input[name="convertGamma"]');
//     let inputValue = selectElement.value;
//     let doubleValue = parseFloat(inputValue);
//
//     let formData = new FormData();
//     formData.append('convertGamma', doubleValue);
//
//     // Отправляем POST-запрос к серверу
//     fetch('http://localhost:8080/convert/convertGamma', {
//         method: 'POST',
//         body: formData
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             // Обрабатываем успешный ответ
//             // Возможно, здесь вы захотите обновить фронтенд
//             return response.json(); // или response.text(), в зависимости от того, что ожидается от сервера
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//         });
// }
function chooseConvertGamma() {
    let selectElement = document.querySelector('input[name="convertGamma"]');
    let inputValue = selectElement.value;
    let doubleValue = parseFloat(inputValue);
    doGamma(doubleValue, "convertGamma");
}
function chooseAssignGamma() {
    let selectElement = document.querySelector('input[name="assignGamma"]');
    let inputValue = selectElement.value;
    let doubleValue = parseFloat(inputValue);
    doGamma(doubleValue, "assignGamma");
}


function doGamma(doubleValue, endpoint) {
    let f = document.getElementById('file').files[0];
    let formData = new FormData();
    formData.append("newGamma", doubleValue);

    fetch(`http://localhost:8080/convert/${endpoint}`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.arrayBuffer())
        .then(data => {
            let r = new FileReader();
            r.onloadend = function () {
                try {
                    parsePPM(data);
                    resizeCanvas();
                    ctx.putImageData(myImageData, 0, 0);
                } catch (err) {
                    console.log(err);
                }
            }
            r.readAsArrayBuffer(f);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });

    console.log(doubleValue)
    ctx.putImageData(myImageData, 0, 0);
}

