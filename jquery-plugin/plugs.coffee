( ($) ->
  #method function

  class Methods
    init:(options)->
      defaults =
        name: "dname"
        age: 10
        sex: "female"
      settings = $.extend {},defaults, options
      console.log defaults
      return

    show:()->
      console.log "show function"

    hide:()->
      console.log "hide function"

  #plugin start

  $.fn.myPlugin = (method)->
    methods = new Methods
    if methods[method]
      methods[method].apply this , Array.prototype.slice(arguments,1)
    else if typeof method is "object"
      methods.init.call this , arguments
    else
      $.error 'methods #{method} does not exit'
) jQuery
