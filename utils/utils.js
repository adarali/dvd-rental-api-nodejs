const _MS_PER_DAY = 1000 * 60 * 60 * 24

exports.dateDiffInDays = (a, b) => {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

exports.buildLinkHeader = function(req, totalCount) {
    let per_page = parseInt(req.per_page || 10);
    let url = exports.getFullUrl(req);
    let params = req.query
    console.log("buildLinkHeader params", params);
    let page = parseInt(params.page || 0)
    let lastPage = Math.floor(totalCount / per_page);
    let nextUrl = getUrl(url, params, page + 1);
    let prevUrl = getUrl(url, params, page - 1);
    let firstPageUrl = getUrl(url, params, 0);
    let lastPageUrl = getUrl(url, params, lastPage);

    let arr = [];
    if(page < lastPage) {
        arr.push(`${nextUrl}; rel="next"`);
    }
    if(page > 0 && page < lastPage) {
        arr.push(`${prevUrl}; rel="prev"`);
    }
    arr.push(`${firstPageUrl}; rel="first"`);
    arr.push(`${lastPageUrl}; rel="last"`);
    return arr.join(",")
}

function getUrl(url, params, page) {
    let myUrl = new URL(url);
    for (const [key, value] of Object.entries(params)) {
        myUrl.searchParams.append(key, value);
    }
    myUrl.searchParams.delete("page");
    myUrl.searchParams.append("page", page);
    return `<${myUrl.href}>`;
}

exports.getFullUrl = function(req) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}