const alertLocale = {
  cooldown: '비회원 사용자는 10초당 하나의 URL만 단축할 수 있습니다.',
  url: 'URL이 잘못 입력되었습니다.',
  passwd: '비밀번호가 잘못 입력되었습니다.'
}

window.onload = function () {
  const alertParam = getUrlParameter('alert')
  const doneParam = getUrlParameter('done')
  const passwdParam = getUrlParameter('passwd')

  if (alertParam) {
    document.getElementsByClassName('alert')[0].style.color = 'rgb(255, 53, 71)'
    document.getElementsByClassName('alert')[0].style.fontWeight = '900'
    document.getElementsByClassName('alert')[0].innerHTML = alertLocale[alertParam]
  }

  if (doneParam) {
    document.getElementsByClassName('title')[0].style.color = 'rgb(116, 255, 53)'
    document.getElementsByClassName('alert')[0].style.color = 'rgb(116, 255, 53)'
    document.getElementsByClassName('title')[0].style.fontWeight = '900'
    document.getElementsByClassName('title')[0].innerHTML = '단축 성공!'
    document.getElementsByClassName('alert')[0].innerHTML = '<a href="/' + doneParam + '">https://eodi.ga/' + doneParam + '</a>'
  }

  if (passwdParam) {
    document.getElementById('locked').onsubmit = function (ev) {
      ev.preventDefault()
      const url = CryptoJS.AES.decrypt(passwdParam, document.forms[0].url.value).toString(CryptoJS.enc.Utf8)
      if (!isURL(url)) {
        document.forms[0].url.value = ''
        document.forms[0].url.style.borderColor = 'red'
      } else window.location.replace(url)
    }
  }
}

function isURL (url) {
  const strRegexp =
    "^((https|http|ftp|rtsp|mms)?://)"
    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
    + "(([0-9]{1,3}\.){3}[0-9]{1,3}"
    + "|([0-9a-z_!~*'()-]+\.)*"
    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
    + "[a-z]{2,6})(:[0-9]{1,4})?((/?)|"
    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"

  const regexp = new RegExp(strRegexp)
  return regexp.test(url)
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(window.location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function captcha () {
  document.forms[0].action = '/_?type=captcha&id=' + getUrlParameter('captcha')
  document.forms[0].submit()
}
