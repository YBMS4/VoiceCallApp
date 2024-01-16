const connection_btn = document.querySelector('#Connection button');
const input = document.querySelector("#Connection input");

const phone_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>';
const user_regular_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>';
const user_solid_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>';

const call_box = document.querySelector("body > footer");

const caller_name = document.querySelector("body > footer > section > header >span:nth-of-type(1)");
const timing = document.querySelector("body > footer > section > header >span:nth-of-type(2)");

const accept_btn = document.querySelector("body > footer button:nth-of-type(1)");
const accept_btn_text = accept_btn.nextElementSibling;

const refuse_btn = document.querySelector("body > footer button:nth-of-type(2)");
const refuse_btn_text = refuse_btn.nextElementSibling;
// console.log("Accept_text: " + accept_btn_text.innerHTML + "\nreject_text: " + refuse_btn_text.innerHTML);

const User = {};

connection_btn.addEventListener("click", () => {
    if(input.value.length > 0){
        connection(input.value);
        connection_btn.disabled = true;
        setTimeout(()=>{
            
            document.querySelector("#Connection").style.height = "0px";
            
        }, 200);
    }else{
        log_msg("Please fill the ID field...");
    }
});

let log_timeout = 0;
function log_msg(msg, color = "rgb(255, 62, 62)"){
    clearTimeout(log_timeout);

    const aside = document.querySelector("aside");
    aside.innerHTML = msg;
    aside.style.color = color;
    aside.style.scale = 1;

    log_timeout = setTimeout(() => {
        aside.style.scale = 0;
        log_timeout = 0;
    }, 3000);
};

console.log(
    new Date().toISOString().split(".")[0].replace("T","_")
)
