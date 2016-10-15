! function(window, $, document, undefined) {
        var  Shorten  = function(element, options){
            this.init(element, options);
        }
        Shorten.SELECTORS = {
            selector: ".shorten",
            tokenSelector: ".shorten-token",
            showMoreSelector: "shorten-show-more"
        };
        Shorten.DEFAULTS={
            limitNum: 200,
            state: "more",
            templateTokenLess: "<span class='shorten-token' style='margin-left:20px;'><a href='javascript:;'>less</a></span>",
            templateTokenMore: "<span class='shorten-token' style='margin-left:20px;'>... <a href='javascript:;'>More</a></span>"
        };

        Shorten.fn = Shorten.prototype = {
            init: function(element, options){
                var ths = this;
                //Option priority: data - options > incoming - options > default -options
                this.options = $.extend({}, Shorten.DEFAULTS, Shorten.SELECTORS, options);
                this.$element = $(element);
                this.addToken();
                this.toggle();
                $(this.options.tokenSelector, this.$element).click(function(){
                    console.log(this);
                    ths.toggle.call(ths);
                })
            },
            toggle: function(){
                this.$element.toggleClass(this.options.showMoreSelector);
            },
            addToken: function(){
                this.more();
                this.less();
            },
            more:function(){
                var ths = this,
                index=0,
                conObj = this.getContent(),
                lastCxt = this.getLastOne(conObj.text,conObj.all);

                conObj.all = conObj.all.replace(lastCxt.lastReg,function(one){

                    if(index == lastCxt.lastIndex){
                        return one + ths.options.templateTokenLess;
                    }
                    index++;
                    return one;
                });

                this.$element.html("<div class='shorten-more'>"+conObj.all +"</div>");
            },
            less:function(){
                var ths = this,
                index=0,
                conObj = this.getContent(),
                text = conObj.text,
                rest="",
                all = conObj.all,
                lastCxt = this.getLastOne(text, all);

                if(text.length > this.options.limitNum){
                    rest = text.substr(this.options.limitNum, text.length);
                    text = text.substr(0, this.options.limitNum);
                }
                console.log(text);

                lastCxt = this.getLastOne(text, all);
                console.log(lastCxt);

                all = all.replace(lastCxt.lastReg,function(one){
                     //console.log(index +" "+lastIndex);
                    if(index == lastCxt.lastIndex){
                        return one + ths.options.templateTokenMore;
                    }
                    index++;
                    return one;
                });
                all = all.split(ths.options.templateTokenMore)[0] + ths.options.templateTokenMore;
                console.log(all);

                this.$element.append("<div class='shorten-less'>"+all+"</div>") ;
            },
            getLastOne:function(text,all){
                var words = text.match(/[\w\.-]+/ig),
                lastOne = words[words.length-1],
                lastReg = new RegExp(lastOne,"ig"),
                lastIndex = all.match(lastReg).length-1;
                return {
                     words: words,
                     lastOne: lastOne,
                     lastReg: lastReg,
                     lastIndex: lastIndex
                }
            },
            getTemplate:function(){
                return this.options.template;
            },
            getTotalText:function(){
                return this.getText().lenght;
            },
            getContent: function(){
                var $resource=this.$element;
                if($(".shorten-more",this.$element).size()){
                    var clone =$(".shorten-more",this.$element).clone();
                    clone.find(".shorten-token").remove();
                    $resource = clone;
                }
                return {
                    text: $resource.text(),
                    all: $resource.html()
                }
            }

        };

        // Plugin Definition
        function Plugin(option) {
            return this.each(function() {
                var $this = $(this),
                    data = $this.data("ng.shorten");

                options = typeof option == "object" ? $.extend({}, option, $this.data()) : $this.data();

                if (!data && /destroy|hide/.test(option)) return;

                if (!data) $this.data('ng.shorten', (data = new Shorten(this, options)));

                if (typeof option == 'string') data[option]();
            })
        }
        var old = $.fn.shorten;

        $.fn.shorten = Plugin;
        $.fn.shorten.Constructor = Shorten;

}(window, jQuery, document);
