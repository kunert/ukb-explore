$(document).ready(function(){

$(".caret").click(function() {
    $(this).siblings(".nested").toggleClass("active");
    $(this).toggleClass("caret-down");
  });

$("li").addClass("p-unselected");
$("li").click(function () { 
	  var cati=$(this).attr('id')
      $("li").removeClass("p-selected").addClass("p-unselected");
      $(this).removeClass("p-unselected").addClass("p-selected");
      var flist=$.parseJSON($.ajax({url:'/field_list',async:false,dataType:"json"}).responseText).plist.map(function(x){return x[0]});
	  $.getJSON('/cat_fields',
	    {cati:cati},
	    function(data){
	    	items=[]
	    	$.each(data.fields,function(key,val){
	    		if (flist.includes(val[0])) {
	    			isChecked='checked';
	    		} else {
	    			isChecked='';
	    		}
	    		items.push('<li id="'+val[0]+'"><input type="checkbox" id="'+val[0]+'" '+isChecked+' />'+val[1]+'</li>');
	    	});
		  	$("#selected-summary").html(data.desc+'<ul class="ukb-fields">'+items.join("")+'</ul>');
	  });
    });
$("li ul").click(function(e){
	e.stopPropagation();
	});

function listChecked(data){
	items=[]
	$.each(data.plist,function(key,val){items.push(val[1]+' ('+val[0]+')')});
	$('#flist').html(items.join(", "));
}

$('#selected-summary').on('change','input:checkbox',function(){
	if (this.checked){
		//the checkbox is checked
		$.getJSON('/field_list',
			{fi:$(this).attr('id'),addTo:'y'},
			function(data){listChecked(data)});
	} else {
		//the checkbox is no longer checked
		$.getJSON('/field_list',
			{fi:$(this).attr('id'),addTo:'n'},
			function(data){listChecked(data)});	
	}
});

$('#clear_flist').click(function(){
	$.getJSON('/reset_flist');
	$.getJSON('/field_list',
			{fi:'',addTo:'echo'},
			function(data){listChecked(data)});
	$('input[type=checkbox]').prop('checked',false);
});

$('#download_flist').click(function(){
	window.location='/download';
});

});
