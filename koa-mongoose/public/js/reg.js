(function () {
    $('[type=submit]').on('click', () => {
        $.ajax({
            method: 'POST',
            url: '/api/user',
            contentType: 'application/json',
            data: JSON.stringify({
                displayName: $('input[name=name]').val(),
                email: $('input[name=email]').val(),
                password: $('input[name=password]').val()
            })
        }).then(resp => {
            if (!resp.errors) {
                window.location='/';
            }
        });
    })
})();