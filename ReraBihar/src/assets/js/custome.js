
    $('input[name="bn"]').change(function() {
        if ($(this).is(':checked') && $(this).val() == '0') {
            $('#myModal').modal('show');
        }
    });
    $('ul.asidenav > li > a').on('click', function(e) {
        e.stopPropagation();
        $('ul.asidenav ul').slideUp();
        $(this).next().is(":visible") || $(this).next().slideDown();
    });
    
    $('li').has('ul').find('a').not('ul ul a').addClass('caret');
        $("#container_div>div").css("display","none");
    
    $(document).ready(function(){
        if($("#container_div").find('div').length>0){
            $("#container_div>div").eq(0).css("display","block");
        }
        if( $(".bounceInDown").find('li').length>0){
            // $(".bounceInDown li").eq(0).addClass('active');
        }
    })
    $(".bounceInDown li a").bind('click',function(e){
        e.preventDefault();
        let atr = $(this).attr("href");
        $(this).parent().parent().children().removeClass("active");
        $(this).parent().addClass("active");
        $("#container_div>div").css("display","none");
        $("#container_div " +atr).css("display","block");  
        });