data_path   = 'exceptions.json';
server      =   window.location.href;
production  =   "https://thedijje.com/colt-app/";
logo_link   =   "https://www.colt.net/wp-content/uploads/2019/01/cropped-Favicon-512-192x192.png";
;
var json_data   = fetch_data();



$(document).ready(function(){
    //load_templates();
    load_countries();

    //console.warn('Powerd by @thedijje');
    
    load_technologies();
    //load_contacts();
    load_queues();
    
 });

function fetch_data(){
    
    $.ajax({
        url: 'data/'+data_path,
        type: 'get',
        async: false,
        success: function(data) {
            result = data;
        } 
     });

    if(server!=production){

        data_file      =   JSON.parse(result);

    }else{

        data_file      =   result;
    
    }

    return data_file;

};

countries   =   function(){

}

$(document).on('change','#queue_type', function(){

    selected_queue_type     =   $('#queue_type').val();
    selected_queue          =   $('#queues').val();

    template_data   =   json_data.queues[selected_queue][selected_queue_type].template;
    //console.log(template_data);
    input_form              =   "";
    template_form_element   =   "";
    t_count           = 0;
    for( var key in template_data){
        
        template_options  =  template_data[key]; 
        
        for(var option in template_options){
            input_form        = input_form + "<input onChange='generate_template(this)' class='template' type='radio' name='template_option_"+t_count+"' value='" +template_options[option]+ "'> "+template_options[option]+" ";
            
        }
        
        template_form_element   =   "<div class='form-group'> <label class='template_option_"+t_count+"'>"+key+"</label><br>"+input_form+"</div>";
        $('#templates').append(template_form_element);
        input_form  =   "";
        t_count =   t_count+1;
    }
    

});






$(document).on('click','.template_clear', function(){

    if(!confirm('Are you sure?')){
        return false;
    }

    $('#final_template').val('');
    $('.copy_section').addClass('d-none');


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
   
    queues   =   json_data.queues;
        
    for(var key in queues){

        $('#queues').append('<option>'+key+'</option>')
      
    }
}

function load_countries(){
    country_data   =   json_data.countries;
    console.log(country_data);

    for(var country in country_data){

        $('#country_list').append('<option>'+country+'</option>')
      
    }
}

$(document).on('change','#queues',function(){
    load_queue_type();
    load_templates();
    $('.validate_template').removeClass('d-none');

});



function load_queue_type(){

    selected_queue =    $('#queues').val();
    $('#queue_type').html('');

    queues  =   json_data.queues[selected_queue];
    
    $('#queue_type').append('<option selected disabled> Select type</option>');

    for(var list in queues){
        
        $('#queue_type').append('<option>'+list+'</option>');
      
    }

}

function load_ero_type(){
    $('#ero_type').html('<option selected disabled>Please select ERO type</option>');

    eros   =   json_data.ero_codes;
        
    for(var key in eros){

        $('#ero_type').append('<option>'+eros[key]+'</option>');
      
    }
}


function load_templates(){
    $('#templates').html('');
    template_data   =   json_data;
    create_template(template_data);
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
    
    technology_list     =   json_data.technologies;
    
    for(var key in technology_list){
        if(technology_list.hasOwnProperty(key)){
            tech_data   =   "<option>"+key+"</option>";
            $('#technologies').append(tech_data);
        }
        
    }

}

$(document).on('change','#technologies', function(){

    
    ero_id      =   $('#ero_generated_id').val();

    if(ero_id!=''){

        if(!confirm('All selection will be reset, cotinue?')){
            return false;
        }

    }

    $('#ero_lists').html('');
    $('#ero_generated_id').val('');
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


function selected_ero(element){
    console.log(element);
    technology_ero  =   $('#technology_ero').val()+$(element).val()+', ';
    $('#technology_ero').val(technology_ero);

}

$('#ero_type').change(function(){

    $('#technology_ero').val($(this).val()+': ');

});

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
                            "<input type='checkbox' class='ero_checklist' onClick='selected_ero(this)' name='ero_list[]' value='"
                            +ero_list[key]
                            +"'> "
                            +ero_list[ero_count]+"<br>";

            
        ero_count++;

    }
    tech_data   =   tech_data+
                            "<input type='checkbox' class='ero_checklist' onClick='selected_ero(this)' name='ero_list[]' value='N/A'> N/A";
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
    $('#ero_generated_id').val('');

});

function clear_field(text_area){
    $('document input[type="checkbox"]').prop("checked", false);
    $('#'+text_area).val('');
}


$('.technology_validate').click(function(){
    selected_eros       =   $('#technology_ero').val();
    ero_generated_id    =   $('#ero_generated_id').val();
    if(selected_eros=='' || ero_generated_id==''){
        alert('Please select at least one ERO and ERO id should not be empty');
        return false;
    }

    $('#ero_generated_id').val('');
    $('#technology_ero').val(selected_eros+'\n' + ero_generated_id);
    technology_value    =   $('#technology_ero').val();
    $('#final_template').append('\n' + technology_value+'\n');
    $('.tech_validate').removeClass('d-none');

});

$('.technology_validate_cancel').click(function(){
    if(!confirm('Are you sure you want to reset and clear?')){
        return false;
    }
    $('.tech_validate').addClass('d-none');
    clear_field('technology_ero');
    $('input[type="checkbox"]').prop("checked", false);
});