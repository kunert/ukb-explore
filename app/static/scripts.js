function openTab(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

function listChecked(data){
	items=[]
	$.each(data,function(key,val){items.push('<span class="fitem"><span class="fitem_desc">'+val[1]+'</span> (<span class="fitem_num">'+val[0]+'</span>)</span>')});
	$('#flist').html(items.join(", "));
	dload=[];
	$('.fitem').each(function(index){
		dload.push($(this).children('.fitem_num').text()+',"'+$(this).children('.fitem_desc').text()+'"\n');
	});
	var properties = {type: 'text/csv'};
	try {
	  file = new File(dload, "output.csv", properties);
	} catch (e) {
	  file = new Blob(dload, properties);
	}
	var url = URL.createObjectURL(file);
	document.getElementById('downlink').href = url;
}

function checkboxFunction(selector){
	var sid=$(selector).attr('id');
	if (selector.checked){
		//the checkbox is checked
		if (flist.includes(sid)==false){
			flist.push(sid);
		}
		//$.getJSON('/field_list',{flist:JSON.stringify(flist)},function(data){listChecked(data)});
	} else {
		//the checkbox is no longer checked
		var index=flist.indexOf(sid);
		if (index > -1){
			flist.splice(index,1);
		}
	}
	$.getJSON('/field_list',{flist:JSON.stringify(flist)},function(data){listChecked(data)});
}
function liCallback(tag) { 
	  var cati=$(tag).attr('id')
      $("li").removeClass("p-selected").addClass("p-unselected");
      $(tag).removeClass("p-unselected").addClass("p-selected");
	  //var flist=$.parseJSON($.ajax({url:'/field_list',async:false,dataType:"json"}).responseText).plist.map(function(x){return x[0]});
	  $.getJSON('/cat_fields',
	    {cati:cati},
	    function(data){
	    	items=[];
	    	$.each(data.fields,function(key,val){
	    		var test=val[0];
	    		if (flist.includes(val[0])) {
	    			isChecked='checked';
	    		} else {
	    			isChecked='';
	    		}
	    		items.push('<li id="'+val[0]+'"><input type="checkbox" id="'+val[0]+'" '+isChecked+' />'+val[1]+'</li>');
	    	});
		  	$("#selected-summary").html(data.desc+'<ul class="ukb-fields">'+items.join("")+'</ul><br><div class="check_all">Select All</div><div class="uncheck_all">Deselect All</div>');
		  	$('#selected-summary').on('change','input:checkbox',function(){checkboxFunction(this)});
	  }).then(function(){
	  	if ($('.search-bar').val().length>2){
		  	$('#selected-summary').html($('#selected-summary').html().replace(RegExp($('.search-bar').val(),'g'), function(match) {return '<span class="hilite">' + match + '</span>'}))
		}
		$('.check_all').click(function(){
			$('input[type=checkbox]').prop('checked',true);
			$('input[type=checkbox]').each(function(){checkboxFunction(this)});
		});
		$('.uncheck_all').click(function(){
			$('input[type=checkbox]').prop('checked',false);
			$('input[type=checkbox]').each(function(){checkboxFunction(this)});
		});
	  });
}

var flist=[];

$(document).ready(function(){

//$(document).on('click',".caret",function() {
$('.caret').click(function(){
    $(this).siblings(".nested").toggleClass("active");
    $(this).toggleClass("caret-down");
  });

$("li").addClass("p-unselected");
//
//$(document).on('click','li',function () { 


$("li").click(function(){
	liCallback(this);
});
$("li ul").click(function(e){
	e.stopPropagation();
});

//$('#selected-summary').on('change','input:checkbox',function(){checkboxFunction(this)});

$('#clear_flist').click(function(){
	flist=[];
	$.getJSON('/field_list',{flist:JSON.stringify(flist)},function(data){listChecked(data)});
	$('input[type=checkbox]').prop('checked',false);
});

$('.search-button').click(function(){
	$.getJSON('/search',
		{query:$('.search-bar').val()},
		function(data){
			var result=[];
			$.each(data.results,function(key,val){
				result.push(val);
			});
			$('#search-results').html("<ul class='search-list'>"+result.join("")+"</ul>");
			
			$(".search-list > li").click(function(){
				liCallback(this);
			});
			$(".search-list > li ul").click(function(e){
				e.stopPropagation();
			});
		});
	});

$('.search-bar').keypress(function (e) {
	var key = e.which;
	if(key == 13)  // the enter key code
	{
	$('.search-button').click();
	return false;  
	}
});   
});
