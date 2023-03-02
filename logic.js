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

const rebuildBlocks = () => {
    getStatus(function(resp) {
        const selector = document.getElementById("status_container");

        const mc = resp.minecraft;
        const http = resp.http;

        const template = (service) => {
            const status = service.status ? "up" : "down";
            return `
                <div class="col">
                    <div class="card shadow-sm">
                        <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false" style="
                            background: url(service_${status}_bg.png);
                            background-position: center;
                            background-repeat: no-repeat;
                            background-size: cover;
                        "><title>${service.title}</title><text x="50%" y="50%" fill="#2a2a2a" dy=".3em">${service.title}</text></svg>
                        <div class="card-body">
                            <p class="card-text">${service.latency}</p>
                        </div>
                    </div>
                </div>
            `;
        };

        selector.innerHTML = "";
        for (let i = 0; i < mc; i++) {
            selector.innerHTML = selector.innerHTML + template(mc[i]);
        }
        for (let i = 0; i < http; i++) {
            selector.innerHTML = selector.innerHTML + template(http[i]);
        }
    });
}

window.onload = () => {
    setInterval(rebuildBlocks, 1000);
}