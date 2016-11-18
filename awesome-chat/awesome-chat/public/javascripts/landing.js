
function login() {
    var args = {
        pUserid: 'PETER',
        pUserType: 'MEMBER',
        pPassword: '123456',
        pSessionId: '0',
        pClientIp: '127.0.0.1',
        pRoomId: '0',
        pLang: 'E',
        isMain: 'true',
        siteName: 'localhost',
        casinoID: '2',
        countryCode: 'EN',
        iLoginTypeID: '1',
        iParentSID: '0'
    };
    $.post('http://localhost:3000/login', args)
        .done(function(data) {
            console.log(data);
        })
        .fail(function(jqXhr, textStatus) {})
        .always(function() {});
}


$(function(){
  $('#startchat').click(function(){
    document.cookie = "nickname=" + $('#nickname').val() + ";; path=/";
    window.location = "/rooms";
  });
    login();
});
