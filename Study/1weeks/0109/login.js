function myfn() {
    let user_id = document.getElementById("txt_id").value;
    if (user_id == "") {
        alert("아이디를 입력하세요");
    } else {
        alert("안녕하세요 " + user_id + " 님");
    }
}