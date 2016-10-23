(function () {
    $('[type=submit]').on('click', () => {
        $.ajax({
            method: 'POST',
            url: '/api/logout',
            contentType: 'application/json',
            data: JSON.stringify({
                _csrf: $('input[name=_csrf]').val()
            })
        }).then(resp => {
            location.reload();
        });
    })
})();