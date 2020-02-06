const targets = document.querySelectorAll('[data-target]');
let modal_backdrop = document.createElement('div');
let btn_target_now = null;
let toggles = Array.from(document.querySelectorAll('[data-toggle]'));
const skeleton = Array.from(document.querySelectorAll('div[class="skeleton"]'));
const file = document.querySelector('.form__file--input')!=null ?document.querySelector('.form__file--input') : '';
const file_span = document.querySelector('.form__file--span') !=null ?document.querySelector('.form__file--span') : '';

if (file!='' && file_span !='') {
  file.addEventListener('change', ()=>{
    file_span.textContent = file.files[0].name;
  })
}

skeleton.forEach((item, i) => {
  item.style.height = item.parentElement.offsetHeight + "px";
});

window.onload = ()=>{
  skeleton.forEach((item, i) => {
    item.style.opacity="0";
    item.style.visibility="hidden";
  });
}


toggles.forEach((el,i)=>{
  let toggle = el.getAttribute('data-toggle');
  if (toggle == 'carousel_content') {
    content = el;
    const content_items = Array.from(content.children);
    const carousel_pagination = document.querySelector('[data-toggle="carousel_pagination"');
    const carousel_pagination_items = Array.from(carousel_pagination.children);
    let translate_start = [];let iter = 0;let start;let timer = null;;

    const carousel_next = document.querySelector('[data-target="carousel_next"]');
    const carousel_back = document.querySelector('[data-target="carousel_back"]');

    function carousel_function(){
      if (iter!=content_items.length) {
        carousel_pagination_items[iter].classList.remove('carousel__pagination--active')
        if (iter!=content_items.length-1){
          carousel_pagination_items[iter+1].classList.add('carousel__pagination--active');
          content.style.transform = `translatex(${translate_start[iter+1]}px)`;
          content.style.transitionDuration = '400ms';
        }else{
          carousel_pagination_items[0].classList.add('carousel__pagination--active');
          content.style.transform = `translatex(${translate_start[0]}px)`;
          content.style.transitionDuration = '400ms';
        }
      }else{
        iter=-1;
      }
      iter ++;
    }

    function  carousel_start(){
      timer = setInterval(carousel_function,(content_items.length-1)*2500);
    };
    function carousel_stop(){
      clearInterval(timer);
    }
    carousel_start();

    carousel_next.addEventListener('click',()=>{
      carousel_stop();
      if (iter==content_items.length) iter=0;
      if (iter != content_items.length -1) {
        carousel_pagination_items[iter].classList.remove('carousel__pagination--active')
        carousel_pagination_items[iter+1].classList.add('carousel__pagination--active')
        content.style.transform = `translatex(${translate_start[iter+1]}px)`;
        content.style.transitionDuration = '400ms';
        iter ++;
      }else{
        carousel_pagination_items[iter].classList.remove('carousel__pagination--active')
        iter = 0;
        carousel_pagination_items[0].classList.add('carousel__pagination--active')
        content.style.transform = `translatex(${translate_start[iter]}px)`;
        content.style.transitionDuration = '400ms';
      }
      carousel_start();
    })
    carousel_back.addEventListener('click', ()=>{
      carousel_stop();
      if (iter != 0) {
        carousel_pagination_items[iter].classList.remove('carousel__pagination--active')
        carousel_pagination_items[iter-1].classList.add('carousel__pagination--active')
        content.style.transform = `translatex(${translate_start[iter-1]}px)`;
        content.style.transitionDuration = '400ms';
        iter --;
      }else{
        carousel_pagination_items[iter].classList.remove('carousel__pagination--active')
        iter = content_items.length - 1;
        carousel_pagination_items[iter].classList.add('carousel__pagination--active')
        content.style.transform = `translatex(${translate_start[iter]}px)`;
        content.style.transitionDuration = '400ms';
      }
      carousel_start();
    })
    const content_items_width = ()=>{
      content_items.forEach((el,i)=>{
        content_items[i].style.width = innerWidth + 'px';
        translate_start[i] = -(innerWidth * i);
        content.style.transform = `translatex(${translate_start[iter]}px)`;
        content.style.transitionDuration = '0ms';
      })
    }
    content_items_width();

    const paginate_back = (index, back=false)=>{
      if (back && index != 0) {
        carousel_pagination_items[index].classList.remove('carousel__pagination--active')
        carousel_pagination_items[index-1].classList.add('carousel__pagination--active')
      }else{
        carousel_pagination_items[index].classList.remove('carousel__pagination--active')
        if (index!=content_items.length-1){
          carousel_pagination_items[index+1].classList.add('carousel__pagination--active');
        }else{
          carousel_pagination_items[0].classList.add('carousel__pagination--active');
        }
      }
    }

    carousel_pagination_items.forEach((el,i)=>{
      el.addEventListener('click',(e)=>{
        carousel_pagination_items[i].classList.add('carousel__pagination--active')
        carousel_pagination_items.forEach((element,index)=>{
          if (i != index) {
            carousel_pagination_items[index].classList.remove('carousel__pagination--active');
          }
        })
        content.style.transform = `translatex(${translate_start[i]}px)`;
        content.style.transitionDuration = '400ms';
        iter = i;
      })
    })

    window.addEventListener('resize', ()=>{
      content_items_width();
    })

    content.addEventListener('touchstart', (event)=>{
      start = event.changedTouches[0].pageX;
      content.style.transitionDuration = '0ms';
      carousel_stop();
      content.addEventListener('touchmove', (e)=>{
        let diff = e.changedTouches[0].pageX - start;
        if (start > e.changedTouches[0].pageX) {
          content.style.transform = `translatex(${translate_start[iter] + diff}px)`
        }else{
          content.style.transform = `translatex(${translate_start[iter] + diff}px)`
        }
        e.preventDefault();
      })
    });

    content.addEventListener('touchend', (e)=>{
      if (start - e.changedTouches[0].pageX > innerWidth / 3) {
          paginate_back(iter,false);
          iter++;
          content.style.transform = `translatex(${translate_start[iter]}px)`
          content.style.transitionDuration = '400ms';
          if (iter>content_items.length-1) {
            iter=0;
            content.style.transform = `translatex(${translate_start[iter]}px)`
            content.style.transitionDuration = '400ms';
            carousel_pagination_items[content_items.length-1].classList.remove('carousel__pagination--active')
          }
      }
      else{
        content.style.transform = `translatex(${translate_start[iter]}px)`
        content.style.transitionDuration = '400ms';
      }
      if (e.changedTouches[0].pageX - start > innerWidth / 3) {
        if (iter > 0 && iter < content_items.length) {
          paginate_back(iter,true);
          content.style.transform = `translatex(${translate_start[iter-1]}px)`
          content.style.transitionDuration = '400ms';
          iter -=1;
        }
      }
      carousel_start();
      e.preventDefault();
    })
  }

  if (toggle == 'acordion') {
    const acordion_items = Array.from(el.children);
    acordion_items.forEach((item, i) => {
      const acordion_btn = item.firstElementChild;
      acordion_btn.addEventListener('click', ()=>{
        const acordion_content = item.lastElementChild;
        const acordion_description = acordion_content.children[0];
        acordion_items.forEach((el,index) =>{
          if (i!=index) {
            el.lastElementChild.style.maxHeight = null;
          }
        })
        if (acordion_content.style.maxHeight) {
          acordion_content.style.maxHeight = null;
        }else{
          acordion_content.style.maxHeight = acordion_description.offsetHeight + "px";
        }
      })

    });

  }

})

targets.forEach((el,i)=>{

  let btn_target =  el;
  let data_target = el.getAttribute('data-target');
  let toggle = el.getAttribute('data-toggle');
  let menu =  document.querySelector(data_target);

  btn_target.addEventListener('click',()=>{

    if (toggle == 'menu-left') {
      menu.classList.add('menu-left__active');
    }
    if (toggle == 'menu-collapse') {
      menu.classList.toggle('menu-collapse--active');
    }
    if(toggle == 'modal'){
      btn_target_now = btn_target;
      menu.classList.add('modal__show');
      document.body.classList.add('modal__open');
      modal_backdrop.classList.add('modal__backdrop');
      document.body.appendChild(modal_backdrop);
    }
    if (toggle == 'card-animate') {
      menu.classList.toggle('card-animate__back--active');
      btn_target.classList.toggle('card-animate__btn--active');
    }
    if (toggle == 'card-flipped') {
      menu.classList.add('card-flipped__item--active');
      let cards_back = Array.from(menu.children)
      cards_back.forEach((item, i) => {
        item.style.zIndex = "10"
      });

      menu.addEventListener('click', (e)=>{
        if (e.target.getAttribute('data-dismiss')!=null ||  e.target.parentElement.getAttribute('data-dismiss') != null) {
          menu.classList.remove('card-flipped__item--active');
          cards_back.forEach((item, i) => {
            item.style.zIndex = "0"
          });
        }
      })
    }
  })

  if (toggle == 'menu-collapse') {
    let scrollYOld = 0;
    window.addEventListener('scroll', ()=>{
      if (innerWidth >= 1024) {
        if (scrollY == 0) {
          menu.parentElement.style.position = "static";
          menu.parentElement.style.opacity = "1";
        }else{
          menu.parentElement.style.opacity = "0";
          if (scrollY < scrollYOld) {
            menu.parentElement.style.position = "fixed";
            menu.parentElement.style.opacity = "1";
          }
          scrollYOld = scrollY;
        }
      }else{
        menu.parentElement.style.opacity = "1";
        if (scrollY > 0) {
          menu.parentElement.style.position = "fixed";
        }else{
          menu.parentElement.style.position = "static";
        }
      }
    });

    window.addEventListener('click', (e)=>{
      if (e.target.getAttribute('data-toggle') !== null) {
        if (e.target.getAttribute('data-toggle').includes('menu-collapse__submenu')) {
          let submenu = document.querySelector(e.target.getAttribute('data-target'));
          if (submenu.style.maxHeight) {
            submenu.style.maxHeight = null;
            e.target.style.transform = "rotate(90deg)";
          }else{
            submenu.style.maxHeight = submenu.scrollHeight + "px";
            e.target.style.transform = "rotate(270deg)";
          }

        }
      }
      if (menu.classList.contains('menu-collapse--active')) {
        if (!e.target.parentElement.parentElement.className.includes('menu-collapse')) {
          menu.classList.remove('menu-collapse--active');
        }
      }
    })

  }

  if (toggle == 'modal') {
    menu.addEventListener('click', (e)=>{
      if (e.target.getAttribute('data-dismiss')!=null) {
        if (btn_target.getAttribute('data-target')==='#'+menu.id) {
          menu.classList.remove('modal__show');
          document.body.classList.remove('modal__open');
          document.body.removeChild(modal_backdrop);
        }
      }
    })

    window.addEventListener('keyup', (e)=>{
      if (document.body.getAttribute('class').includes('modal__open')) {
        if (e.keyCode===27) {
          let menu = document.querySelector(btn_target_now.getAttribute('data-target'));
          document.body.classList.remove('modal__open');
          document.body.removeChild(modal_backdrop);
          menu.classList.remove('modal__show');
        }
      }
    });

    window.addEventListener('click', (e)=>{
        if (e.target.classList[0]=='modal') {
          if (btn_target_now.getAttribute('data-target')==='#'+menu.id) {
            menu.classList.remove('modal__show');
            document.body.classList.remove('modal__open');
            document.body.removeChild(modal_backdrop);
          }
      }

    })
  }

  if (toggle=='menu-left') {
    window.addEventListener('click', (e)=>{

      if (e.target.getAttribute('class')!=null) {
        if (!e.target.getAttribute('class').includes('menu-open') &&
            menu.getAttribute('class').includes('menu-left__active'))
        {
          if (e.target.offsetParent==null) {
              let menus_close = Array.from(document.querySelectorAll('[class="menu-left__submenu menu-left__active'));
              menus_close.forEach((el)=>{
                el.classList.remove('menu-left__active');
              })

              menu.classList.remove('menu-left__active');
          }
        }
      }
      if (e.target.getAttribute('data-target')==='menu-left__submenu') {
          const submenu = document.querySelector(e.target.getAttribute('data-toggle'))
          submenu.classList.add('menu-left__active')
      }
      if (e.target.getAttribute('class')!=null && e.target.getAttribute('class').includes('menu-close')) {
        let close_menu =  e.target.parentElement.parentElement;
        if (close_menu.getAttribute('class').includes('menu-left__list--small')) {
          menu.classList.remove('menu-left__active');
        }
        close_menu.classList.remove('menu-left__active');
      }
    })
  }

})
