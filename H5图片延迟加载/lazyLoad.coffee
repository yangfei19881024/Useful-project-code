(($)->

  class LazyLoad

    belowthefold : (element)->
      fold = $(window).height() + $(window).scrollTop()
      fold <= $(element).offset().top

    abovethetop : (element)->
      top = $(window).scrollTop();
      top >= $(element).offset().top + $(element).height()

    inViewport : (element)=>
      console.log @belowthefold(element)
      !@belowthefold(element) and !@abovethetop(element)

    getInViewportList : ()->
      list = $("#bookList li")

      ret = []
      list.each (i) =>
        # console.log "#{i}"
        li = list.eq(i)
        if @inViewport(li)
            console.log "asdfs"
            @loadImg(li)
      return

    loadImg : (li)->
      console.log "load"
      if li.find('img[_src]').length
          img = li.find('img[_src]')
          src = img.attr('_src')
          img.attr('src', src).load ()->
            img.removeAttr('_src')
      return


  # getInViewportList()

  $.fn.lazyLoad = (options)->
    defaults = {

    }

    settings = $.extend {},defaults,options

    lazyload = new LazyLoad
    lazyload.getInViewportList(settings)

    $("window").on "scroll" ,()->
      lazyload.getInViewportList(settings)

    return

  return

) jQuery
