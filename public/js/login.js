(function () {
    $('[type=submit]').on('click', () => {
        $.ajax({
            method: 'POST',
            url: '/api/login',
            contentType: 'application/json',
            data: JSON.stringify({
                email: $('input[name=email]').val(),
                password: $('input[name=password]').val()
            })
        }).then(resp => {
            location.reload();
        });
    })
})();