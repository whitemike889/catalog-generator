(function(){var t,e,o=function(t,e){return function(){return t.apply(e,arguments)}},n={}.hasOwnProperty,r=function(t,e){function o(){this.constructor=t}for(var r in e)n.call(e,r)&&(t[r]=e[r]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t};t=function(){function t(){this.stalk=o(this.stalk,this),this.audioSupported=Modernizr.audio.ogg||Modernizr.audio.mp3,$(window).on("keydown.raptorz",this.stalk)}return t.prototype.audioSupported=!1,t.prototype.locked=!1,t.prototype.raptorImageMarkup='<img id="elRaptor" style="display: none" src="'+Application.url+'/assets/img/raptor.png" />',t.prototype.raptorAudioMarkup='<audio id="elRaptorShriek" preload="auto"><source src="'+Application.url+'/assets/media/raptor-sound.mp3" /><source src="'+Application.url+'/assets/img/raptor-sound.ogg" /></audio>',t.prototype.css={position:"fixed",bottom:"-700px",right:"0",display:"block"},t.prototype.konami="38,38,40,40,37,39,37,39,66,65",t.prototype.key_history=[],t.prototype.raptor=null,t.prototype.stalk=function(t){return this.key_history.push(t.keyCode),(""+this.key_history).indexOf(this.konami)>=0?this.attack():void 0},t.prototype.append=function(){return $("body").append(this.raptorImageMarkup),this.audioSupported&&$("body").append(this.raptorAudioMarkup),this.raptor=$("#elRaptor"),this.reset()},t.prototype.rawr=function(){return this.audioSupported?document.getElementById("elRaptorShriek").play():void 0},t.prototype.attack=function(){var t=this;return this.locked=!0,null==this.raptor&&this.append(),this.rawr(),this.raptor.animate({bottom:"0"},function(){return t.raptor.animate({bottom:"-130px"},100,function(){return t.raptor.delay(300).animate({right:t.raptor.position().left+400},2200,function(){return t.reset()})})})},t.prototype.reset=function(){return this.key_history=[],this.locked=!1,this.raptor.css(this.css)},t}(),Application.raptorz=new t,e=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.routes={"":"index",upload:"upload","import":"import","export":"export"},e.prototype.index=function(){return new Application.Views.Index({collection:Application.datasets}).render()},e.prototype.upload=function(){return(new Application.Views.Upload).render()},e.prototype["import"]=function(){return this.navigate("upload",!0)},e.prototype["export"]=function(){return new Application.Views.Export({collection:Application.datasets}).render()},e}(Backbone.Router),Application.Router=new e,Application.Models.Dataset=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.defaults=function(){var t;return t={},Application.schema.basic.forEach(function(e){return t[e.get("json")]=null}),t},e.prototype.initialize=function(){var t,e,o,n;this.fields=new Application.Collections.Fields,this.view=new Application.Views.Dataset({model:this}),o=this.attributes,n=[];for(t in o)e=o[t],n.push(this.fields.add(Application.schema.get(t).toJSON()));return n},e}(Backbone.Model),Application.Collections.Datasets=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.model=Application.Models.Dataset,e.prototype.getJSON=function(){return JSON.stringify(this.toJSON())},e.prototype.getHTML=function(){return'<div class="datasets">\n'+this.getTemplated("html")+"</div>\n"},e.prototype.getXML=function(){return"<datasets>\n"+this.getTemplated("xml")+"</datasets>\n"},e.prototype.getTemplated=function(t){var e,o;return e="",o=Application.Templates[t],this.each(function(t){return e+=o({schema:Application.schema,dataset:t.toJSON()})}),e},e}(Backbone.Collection),Application.Models.Field=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.defaults={definition:"",json:"",name:"",rdfa:"",type:"text",value:""},e.prototype.initialize=function(){return this.view=new Application.Views.Field({model:this})},e}(Backbone.Model),Application.Collections.Fields=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.model=Application.Models.Field,e.prototype["import"]=function(t){var e=this;return _.each(t,function(t){return e.add(new Application.Models.Field(t))})},e}(Backbone.Collection),Application.Collections.Schema=function(){function t(){this.initFields=o(this.initFields,this),$.ajax("schema.yml",{success:this.initFields,async:!1})}return t.prototype.types=[],t.prototype.initFields=function(t){var e,o,n,r;n=jsyaml.load(t),r=[];for(o in n)e=n[o],-1===$.inArray(o,this.types)&&this.types.push(o),this[o]=new Application.Collections.Fields,r.push(this[o]["import"](e));return r},t.prototype.get=function(t){return _.clone(_.first(this.all().where({json:t})))},t.prototype.all=function(){var t,e,o,n,r;for(t=new Application.Collections.Fields,r=this.types,o=0,n=r.length;n>o;o++)e=r[o],t.add(this[e].toJSON());return t},t}(),Application.Views.Dataset=function(t){function e(){return this.addField=o(this.addField,this),this.render=o(this.render,this),e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.template=Application.Templates.dataset,e.prototype.tagName="div",e.prototype.className="dataset",e.prototype.events={"click .remove_dataset":"removeDataset","change input":"update","change .expanded_fields":"addExpanded"},e.prototype.render=function(){return this.$el.html(this.template(this.model.toJSON(),{schema:Application.schema})),this.model.fields.forEach(this.addField),this},e.prototype.removeDataset=function(t){return t.preventDefault(),confirm("Are you sure you would like to remove this dataset?")&&(this.model.destroy(),this.remove()),!1},e.prototype.update=function(t){var e;return e=this.$(t.target),this.model.set(e.data("field"),e.val())},e.prototype.addExpanded=function(t){var e;return e=$(t.target),this.model.fields.add(Application.schema.get(e.val()).toJSON()),e.children("option:selected").remove(),1===e.children().length?e.parent().parent().remove():void 0},e.prototype.initialize=function(){return this.model.fields.on("add",this.addField),this.model.on("add",this.render),this.model.on("change:title",this.render)},e.prototype.addField=function(t){return t.view.dataset=this.model,this.$el.find(".fields").append(t.view.el),t.view.render()},e}(Backbone.View),Application.Views.Export=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.el="#content",e.prototype.template=Application.Templates["export"],e.prototype.events={"focus .copy_zone":"select","mouseup .copy_zone":"preventDefault"},e.prototype.render=function(){return this.$el.html(this.template({json:this.collection.getJSON(),xml:this.collection.getXML(),html:this.collection.getHTML()})),this.initDownload()},e.prototype.select=function(t){return t.target.select()},e.prototype.preventDefault=function(t){return t.preventDefault,t.stopPropegation,!1},e.prototype.initDownload=function(){return $(".download").downloadify({swf:Application.url+"/swf/downloadify.swf",downloadImage:Application.url+"/assets/img/download.png",filename:function(){return"data."+$(this.el).attr("data-type")},data:function(){return $("#"+$(this.el).attr("data-type")).val()}})},e}(Backbone.View),Application.Views.Field=function(t){function e(){return this.input=o(this.input,this),e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.tagName="div",e.prototype.className="field",e.prototype.template=Application.Templates.field,e.prototype.input=function(){return Application.Templates["fields/"+this.model.get("type")]},e.prototype.render=function(){var t,e;return e=this.input(),t=this.model.toJSON(),t.value=this.dataset.get(this.model.get("json")),this.$el.html(this.template({dataset:this.dataset.toJSON(),field:e(t),model:this.model.toJSON()}))},e}(Backbone.View),Application.Views.Import=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.el="#content",e.prototype.template=Application.Templates["import"],e.prototype.events={"click #import":"import"},e.prototype.render=function(){var t;return t=Application.schema.all().toJSON(),this.$el.html(this.template({schema:t,fields:this.getFields()}))},e.prototype.getFields=function(){var t;return t=[],$.each(this.collection,function(e,o){return $.each(o,function(e){return-1===$.inArray(e,t)?t.push(e):void 0})}),t},e.prototype["import"]=function(){var t=this;return $.each(this.collection,function(e,o){var n;return n=new Application.Models.Dataset,$.each(o,function(e,o){var r;return(r=t.map(e))?n.set(r,o):void 0}),Application.datasets.add(n)}),Application.Router.navigate("",!0)},e.prototype.map=function(t){return $("#map\\["+t+"\\]").val()},e}(Backbone.View),Application.Views.Index=function(t){function e(){return this.addDataset=o(this.addDataset,this),e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.template=Application.Templates.index,e.prototype.el="#content",e.prototype.events={"click #add_dataset":"add"},e.prototype.render=function(){var t=this;return this.$el.html(this.template()),this.collection.forEach(function(e){return t.addDataset(e)})},e.prototype.addDataset=function(t){return this.$(".datasets").append(t.view.el)},e.prototype.initialize=function(){return this.collection.on("add",this.addDataset),0===this.collection.size()?this.add():void 0},e.prototype.add=function(){return this.collection.add({})},e}(Backbone.View),Application.Views.Upload=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return r(e,t),e.prototype.el="#content",e.prototype.template=Application.Templates.upload,e.prototype.events={"change input":"selectFile","dragover #drop_zone":"dragOver","dragleave #drop_zone":"dragOut","drop #drop_zone":"drop"},e.prototype.initialize=function(){return jQuery.event.props.push("dataTransfer"),this.canHazFile()?void 0:this.template=function(){return'<p>Your browser is not supported. Please consider <a href="http://browsehappy.com/">upgrading</a>.'}},e.prototype.render=function(){return this.$el.html(this.template())},e.prototype.canHazFile=function(){return null==window.File||null==window.FileReader||null==window.FileList||null==window.Blob?!1:!0},e.prototype.selectFile=function(t){return this.read(t.target.files[0])},e.prototype.dragOver=function(t){return t.stopPropagation(),t.preventDefault(),t.dataTransfer.dropEffect="copy",$("#drop_zone").addClass("hover"),!1},e.prototype.dragOut=function(t){return t.stopPropagation(),t.preventDefault(),$("#drop_zone").removeClass("hover"),!1},e.prototype.drop=function(t){return t.stopPropagation(),t.preventDefault(),this.read(t.dataTransfer.files[0]),$("#drop_zone").removeClass("hover"),!1},e.prototype.read=function(t){var e,o=this;return e=new FileReader,e.onload=function(t){var e,n;return e=o.parseFile(t.target.result),n=new Application.Views.Import({collection:e}),n.render(),Application.Router.navigate("import")},e.readAsText(t)},e.prototype.parseFile=function(t){var e;try{return e=JSON.parse(t)}catch(o){return e=$.csv.toObjects(t)}finally{return e}},e}(Backbone.View)}).call(this);