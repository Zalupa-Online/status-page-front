const requestCall = (callback, url, method, json = false, json_body = null) => {
    let request = new XMLHttpRequest();
    let json_body_local = {};
    request.open(method, url, true);

    if (method.toUpperCase() === "POST") {
        request.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
        );
        json_body_local = JSON
            .stringify(json_body);
    }

    request.onload = function () {
        if (request.status >= 200 &&
            request.status < 400) {
            if (json) {
                callback(JSON.parse(
                    request
                        .responseText
                ));
            } else {
                callback(request
                    .responseText
                );
            }
        } else {
            console.error(
                `Error get response! Status code: ${request.status}`
            );
        }
    };

    request.onerror = function (error) {
        console.error(
            `Error make request! Error: ${error}`
        );
        callback(null)
    };

    request.onreadystatechange = () => {
        if (request.status >= 400) {
            if (json) {
                callback({
                    success: false
                });
            } else {
                callback(null);
            }
        }
    };

    request.send(json_body_local);
}

const getStatus = (callback) => {
    requestCall((r) => {
        callback(r);
    }, "https://api-status.zalupa.online/", "GET", true, null);
}