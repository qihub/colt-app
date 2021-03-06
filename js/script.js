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

    load_links();
    
 });

function fetch_data(){
    
    var result = $.ajax({
        url: 'data/'+data_path,
        type: 'get',
        async: false,
         
     });

    console.log(result);
     data_file      =   JSON.parse(result.responseText);


    return data_file;

};

countries   =   function(){

}

$(document).on('change','#queue_type', function(){

    selected_queue_type     =   $('#queue_type').val();
    selected_queue          =   $('#queues').val();
    $('#templates').html('');

    template_data   =   json_data.queues[selected_queue][selected_queue_type].template;
    //console.log(template_data);
    input_form              =   "";
    template_form_element   =   "";
    t_count           = 0;
    for( var key in template_data){
        
        template_options  =  template_data[key]; 
        
        for(var option in template_options){
            input_form        = input_form + "<input data-template-name='"+key+"' class='template_option template' type='radio' name='template_option_"+t_count+"' value='" +template_options[option]+ "'> "+template_options[option]+" ";
            
        }
        
        template_form_element   =   "<div class='form-group'> <label class='template_text template_option_"+t_count+"'>"+key+"</label><br>"+input_form+"</div>";
        $('#templates').append(template_form_element);
        input_form  =   "";
        t_count =   t_count+1;
    }
    $('.validate_template').removeClass('d-none');
    
    

});

function compile_template(){
    
    $('#final_template').val('');
    template_val    =   '';
    $('#templates .form-group').each(function(index, element){
        opt_label = $(this).children('label').text()
        opt_val = $(this).children('input:checked').val();
        single_template =   opt_label+'\n'+opt_val+'\n';
        if(!opt_val || opt_val===null){
            
            single_template =   '';
        }
        
        template_val = template_val+single_template;
        $('#final_template').val(template_val);
    });

}

$(document).on('click','.template_clear', function(){

    if(!confirm('Are you sure?')){
        return false;
    }

    $('#final_template').val('');
    $('.copy_section').addClass('d-none');


});


$('#country_list').change(function(){

    fetch_delivery_address();
    fetch_exceptions();
    load_contacts();


});


function load_contacts(){
    selected_country    =   $('#country_list').val();
    
    $('#contact_list_data').html('');

    contact_list    =   json_data.contact_list[selected_country];
    
    contact_count   =   0;
    $(contact_list).each(function(key, val){
        $('#contact_list_data').append("<li>"+val+"</li>");
    });
    
    
}

function fetch_exceptions(){

    selected_country    =   $('#country_list').val();
    $('#exception_data').html('');

    exception_list  =   json_data.countries[selected_country].exception;

    for(key in exception_list){
        $('#exception_data').append("<li>"+exception_list[key]+"</li>");
    }

}

function fetch_delivery_address(){
    $('#delivery_list').html('');
    $('.delivery_c_heading').text('');
    selected_country    =   $('#country_list').val();
    
    address             =   json_data.countries[selected_country];
    
    $('.delivery_c_heading').html(': '+selected_country);
    if(address.delivery_address){
        country_delivery    =   address.delivery_address;

        for(i in country_delivery){
            $('#delivery_list').append("<li>"+country_delivery[i]+"</li>");
        }

    }
    
    

}

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
    selected_tech   =   $('#technologies').val();
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
    compile_template();

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
    $('#ero_type').html("<option selected disabled>Please select</option>");
    selected_tech    =   $('#technologies').val();
    var technology =    $(this).val();


    fetch_ero_code();


    tech_ero         =   json_data.ero_codes;
    for(key in tech_ero){

        $('#ero_type').append("<option>"+tech_ero[key]+"</option>")

    }
    

    
});



function selected_ero(element){
    console.log(element);
    technology_ero  =   $('#technology_ero').val()+$(element).val()+', ';
    $('#technology_ero').val(technology_ero);

}



function fetch_ero_code(){
    selected_tech   =   $('#technologies').val();
    ero_list    =   json_data.technologies[selected_tech];
    clear_field('technology_ero');
    
    ero_count       =   0;
    tech_data       =   "";
    for(var key in ero_list){
        
        tech_data   =   tech_data+
                            "<input type='checkbox' name='ero_list' class='ero_checklist' value='"
                            +ero_list[key]
                            +"'> "
                            +ero_list[ero_count]+"<br>";

            
        ero_count++;
    }
    $('#ero_lists').append(tech_data);

}

function write_ero(element){
    // selected_ero_type   =   $(element).val();
    // tech_ero_value      =   $('#technology_ero').val();
    // $('#technology_ero').val(tech_ero_value+selected_ero_type+', ');

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
    
    if(ero_generated_id==''){
        alert('Please enter generated ERO first');
        return false;
    }



    
   
    ero_type    =   $('#ero_type').val();
    generated_ero_id =  $('#ero_generated_id').val();
    checked_item    =   '';
    $('.ero_checklist:checked').each(function(){
        checked_item = checked_item+', '+$(this).val()
    });

    technology_ero_data     =   ero_generated_id+": "+checked_item+"\n"+ero_generated_id;

    $('#technology_ero').val(technology_ero_data);
    $('.tech_validate').removeClass('d-none');
    template_val    =   $('#final_template').val();
    $('#final_template').val(template_val+'\n'+technology_ero_data);

   

});

$('.technology_validate_cancel').click(function(){
    if(!confirm('Are you sure you want to reset and clear?')){
        return false;
    }
    $('.tech_validate').addClass('d-none');
    clear_field('technology_ero');
    $('input[type="checkbox"]').prop("checked", false);
});

function load_links(){
    links = json_data.links;
    $.each( links, function( key, value ) {
        $('#link_list').append("<li><a target='_blank' href='"+value+"'>"+key+"</a></li>")
    });
}