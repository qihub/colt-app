var data_path = 'exceptions.json';
var server       =   window.location.href;
var production      =   "http://thedijje.com/colt-app/";

$(document).ready(function(){
   //load_templates();
   load_technologies();
   load_contacts();
   load_countries();
   load_queues();
   console.warn('Powerd by @thedijje');
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
        $('#exception_data').html("");
        for(var key in country_exception){

            $('#exception_data').append('<li>'+country_exception[key]+'</li>')
          
        }

        
    });
    
    

});

function load_queues(){
    $.get('data/'+data_path, function(data){
       
        if(server!=production){
            template_data      =   JSON.parse(data);
        }else{
            template_data      =   data;
        }
       
        queues   =   template_data.queues;
        
        for(var key in queues){

            $('#queues').append('<option>'+queues[key]+'</option>')
          
        }
        
    });
}

function load_countries(){
    $.get('data/'+data_path, function(data){
       
        if(server!=production){
            template_data      =   JSON.parse(data);
        }else{
            template_data      =   data;
        }
       
        countries   =   template_data.countries;
        
        for(var country in countries){

            $('#country_list').append('<option>'+countries[country]+'</option>')
          
        }
        
    });
}

$(document).on('change','#queues',function(){

    load_templates();
    $('.validate_template').removeClass('d-none');

});


function load_ero_type(){
    $('#ero_type').html('<option selected disabled>Please select ERO type</option>');

    $.get('data/'+data_path, function(data){
       
        if(server!=production){
            ero_data      =   JSON.parse(data);
        }else{
            ero_data      =   data;
        }
       
        eros   =   ero_data.ero_codes;
        
        for(var key in eros){

            $('#ero_type').append('<option>'+eros[key]+'</option>');
          
        }
        
    });
}


function load_templates(){
    $('#templates').html('');
    $.get('data/'+data_path, function(data){
       
        if(server!=production){
            template_data      =   JSON.parse(data);
        }else{
            template_data      =   data;
        }
       
        create_template(template_data);
        
    });

    show_templates();
}

function create_template(template_data){
    templates       =   template_data.templates;
        template_count  =   0;
        for(var key in templates){
            if(templates.hasOwnProperty(key)){

                option_lists    =   templates[key];
                input_forms     =   "";
                
                for(var options in option_lists){

                    input_forms =   input_forms+" <input type='radio' value='"+option_lists[options]+"' class='template' onChange='generate_template(this)' name='template_"+template_count+"'> "+option_lists[options]
                }
                
                html_data   =   '<div class="form-group">'+
                '<label class="template_name template_'+template_count+'">'+key+'</label>'+
                '<br> '+input_forms+
                '</div>';
                $('#templates').append(html_data);
                template_count  =   template_count+1;
            }
        }
}

function generate_template(element, target='final_template'){

    el_name = $(element).attr('name');
    text_data    =   $('.'+el_name).text();
    el_selection    =   $('input[name="'+el_name+'"]:checked').val();
    //alert(el_selection);

    $('#'+target).append(text_data+" : "+el_selection+"\n");

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
    $('#ero_lists').html('');
    var technology =    $(this).val();
    $.get('data/'+data_path, function(data){
        if(server!=production){
            
            ero        =   JSON.parse(data);
        }else{
            ero        =   data

        }

        ero_list        =   ero.technologies[technology];
        ero_codes       =   ero.ero_codes;
       
           
       fetch_technology(ero_list);
       fetch_ero_code(ero_codes);
       load_ero_type();

    });

});

function write_ero(element){
    
    $('#technology_ero').val($(element).val());
        
}

function fetch_ero_code(ero_list){
    clear_field('technology_ero');
    
    ero_count       =   0;
    tech_data       =   "";
    for(var key in ero_list){
        
        tech_data   =   tech_data+
                            "<input type='checkbox' name='ero_list' onclick='write_ero(this)' class='ero_checklist' value='"
                            +ero_list[key]
                            +"'> "
                            +ero_list[ero_count]+"<br>";

            
        ero_count++;
    }
    $('#ero_type').append(tech_data);

}

function fetch_technology(){
    ero_count       =   0;
    tech_data       =   "";
    for(var key in ero_list){
        
        tech_data   =   tech_data+
                            "<input type='checkbox' class='ero_checklist' name='ero_list[]' value='"
                            +ero_list[key]
                            +"'> "
                            +ero_list[ero_count]+"<br>";

            
        ero_count++;
    }
    $('#ero_lists').append(tech_data);
    
}

function show_templates(){
    $('.templates_body').removeClass('d-none');
}


function load_contacts(){
    $('#contact_list_data').html("");
    $.get('data/'+data_path, function(data){
        if(server!=production){
            
            json_data        =   JSON.parse(data);
        }else{
            json_data        =   data

        }

        contacts_data           =   json_data.contact_list;

        for(var key in contacts_data){
            
            
            
            $('#contact_list_data').append("<p><i class='fa fa-user fa-fw'></i> "+contacts_data[key]);

                
           
        }
        
    });
}


function validate_tech(){
    $('.technology_validate').removeClass('d-none');
}


$(document).on('click','.clear_tech', function (){


    if(!confirm('Are you sure?')){
        return false;
    }

    $('#technology_ero').val('');

});

function clear_field(text_area){
    $('#'+text_area).val('');
}