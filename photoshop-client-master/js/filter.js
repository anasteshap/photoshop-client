function filter() {
    let filterTypeElement = document.querySelector('select[name="filterType"]');
    let filterType = filterTypeElement.value;

    let params = document.querySelector('input[name="params"]');

    let formData = new FormData();
    formData.append("filterName", filterType);
    formData.append("params", params.value.split(' '));

    fetch(`http://localhost:8080/filter/filter`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.arrayBuffer())
        .then(data => {
            try {
                parsePPM(data);
                resizeCanvas();
                ctx.putImageData(myImageData, 0, 0);
            } catch (err) {
                console.log(err);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });

    ctx.putImageData(myImageData, 0, 0);
}