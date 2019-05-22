var data_path = 'exceptions.json';
var server       =   window.location.href;
var production      =   "http://thedijje.com/colt-app/";

$(document).ready(function(){
   //load_templates();
   load_technologies();
});


$('#country_list').change(function(){
    $('#exception_data').html(
        '<i class="fa fa-spinner fa-pulse"></i> Loading..'
    );
    country_name     =   $(this).val();
    
    $.get('data/'+data_path, function(data){
       
        if(server!=production){

            exceptions      =   JSON.parse(data);

        }else{

            exceptions      =   data;
        
        }

        country_exception   =   exceptions.exception[country_name];
        if(!country_exception || country_exception==''){
            //alert('No Exception found in country '+country_name);
            $('#exception_data').html(
                '<span class="text-danger"><i class="fa fa-times-circle"></i> No exception found</span>'
            );
            return false;
        }
        $('#exception_data').html(country_exception);
    });
    
    

});

$(document).on('change','#queues',function(){

    load_templates();

});


function load_templates(){

    $.get('data/'+data_path, function(data){
       
        if(server!=production){
            template_data      =   JSON.parse(data);
        }else{
            template_data      =   data;
        }
       
        
        templates       =   template_data.templates;
        template_count  =   0;
        for(var key in templates){
            if(templates.hasOwnProperty(key)){

                option_lists    =   templates[key];
                input_forms     =   "";
                
                for(var options in option_lists){

                    input_forms =   input_forms+" <input type='radio' name='template_"+template_count+"'> "+option_lists[options]
                }
                
                html_data   =   '<div class="form-group">'+
                '<label>'+key+'</label>'+
                '<br> '+input_forms+
                '</div>';
                $('#templates').append(html_data);
                template_count  =   template_count+1;
            }
        }

       
       

    });

    show_templates();
    

}

$(document).on('click','.validate_template',function(){

    $('.copy_section').removeClass('d-none');

});

function load_technologies(){
    
    $.get('data/'+data_path, function(data){
        if(server!=production){
            
            technologies        =   JSON.parse(data);
        }else{
            technologies        =   data

        }
        technology_list     =   technologies.technologies;
        
        for(var key in technology_list){
            if(technology_list.hasOwnProperty(key)){
                tech_data   =   "<option>"+key+"</option>";
                $('#technologies').append(tech_data);
            }
            
        }

    });
}

$(document).on('change','#technologies', function(){

});

function show_templates(){
    $('.templates_body').removeClass('d-none');
}
