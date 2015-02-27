function Modal(opts) {
    this.title = opts.title;
    this.bodyContent = opts.content;
    this.leftBtn = opts.leftBtn || '确认';
    this.rightBtn = opts.rightBtn || '取消1';

    this.createModelDOM();
    this.bindDOM();

}

Modal.prototype.createModelDOM = function(){

    var modalStr = "";
                modalStr += '<div class="overlay" id="overlay">'
                         +   '<section class="modal" id="modal">'
                         +     '<div class="modal-hd">'+this.title+'</div>'
                         +     '<div class="modal-bd">'
                         +		this.bodyContent
                         +     '</div>'
                         +     '<div class="modal-ft">'
                         +       '<span class="btn-modal">'+this.leftBtn+'</span><span class="btn-modal">'+this.rightBtn+'</span>'
                         +     '</div>'
                         +   '</section>'
                         + '</div>';

    $('body').append(modalStr);

}

Modal.prototype.bindDOM = function(){
    var self = this;
    var $overlay = $("#overlay");
    var $whichModal = $('#modal');

    $overlay.addClass('active')

    $whichModal.animate({"display":"block"},100,function(){
        $(this).addClass('modal-in');
    });

    $('.btn-modal').tap(function(e){
        self.modalHidden($whichModal);
        e.stopPropagation();
    });

    $overlay.tap(function(e){
        if(e.target.classList.contains('overlay')){
            self.modalHidden($whichModal);
        }

    });
}

Modal.prototype.modalHidden = function($ele){
        var $overlay = $("#overlay");

        $ele.removeClass('modal-in');
        $ele.one('transitionend',function(){
            //$ele.css({"display": "none"});
            $overlay.removeClass('active');
        });


}