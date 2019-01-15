var lojasVirgulas = "";
function buscaXML()
{
    //1278,1272,1254 loja não existe para teste
    //19459, mudança de codigo de loja para teste
    var x, i, txt, xmlDoc,machine, srvtag, model, loja, CodigoAtual,ljx, resulttxt, valdesativado;
    resulttxt =  "Resultado obtido: ";

    document.getElementById("saida").innerHTML = resulttxt;
    //document.getElementById("inputcsv").value = "";
    var csvString = document.getElementById("inputcsv").value;    
    if (!(csvString == "") && !(csvString == null)) {
        document.getElementById("ljbusca").value = parseCSV();       
    }
        
    
    var codigoNovo = false;
    var filexml="xml/allBrasil.xml";
    var urlxml = "https://landesk.e-boticario.com.br/MBSDKService/MsgSDK.asmx/RunQuery?queryName=Brasil_bot_qdb_pcs";    
        
    //var spanred = "<span style=\"color:red\">";
    //var spanend = "</span>";
    var separador = " | ";
    var spanred = "<span class=\"badge badge-pill badge-danger text-white\">";
    var spanend = "</span>";
    var lb = "</br>";
    var notfound = true;
    var cont = 0;
    var zeros = "0";   
    var inputField = "<input type=\"text\" value=\"";
    var inputFieldRO = "<input type=\"text\" readonly value=\"";
    var inputFieldEnd = "\">";
    var valdesativado = "desativado\" style=\"text-decoration: line-through;\"";
    var showip = false;
    var ipnumber = "0.0.0.0";
    var headResult = inputFieldRO+"Loja"+inputFieldEnd+separador+inputFieldRO+"Device"+inputFieldEnd+separador+inputFieldRO+"Modelo"+inputFieldEnd+separador+inputFieldRO+"Service Tag"+inputFieldEnd+lb
    var headResultIP = inputFieldRO+"Loja"+inputFieldEnd+separador+inputFieldRO+"Device"+inputFieldEnd+separador+inputFieldRO+"Modelo"+inputFieldEnd+separador+inputFieldRO+"Service Tag"+inputFieldEnd+separador+inputFieldRO+"I.P."+inputFieldEnd+lb
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            leiaxml(this);
        }
    }
    xhttp.open("GET", filexml,true);
    xhttp.send();
    
    function leiaxml(xml){
        ljx = document.getElementById("ljbusca").value;
        xmlDoc = xml.responseXML;
        txt = "";
        x = xmlDoc.getElementsByTagName("Table");    

        if (ljx == null || ljx == "") {
            alert("Campo de busca esta vazio");
		    document.getElementById("ljbusca").focus();
        } else {
            if ((ljx.includes(",")) || (ljx.includes("\t"))) {
                var ljxArray = new Array();
                ljxArray = ljx.split(",");
                var checkMostraIP = document.getElementById("customCheck2").checked            
                if (checkMostraIP) {
                    showip = true;
                }
                if(showip){
                    txt = headResultIP;
                }else{
                    txt = headResult;
                }
                readArray(ljxArray);
                ljxArray.length = 0;
            } else {
                var checkExact = document.getElementById("customCheck1").checked            
                if (checkExact) {
                    ljx=addZeros();            
                }
                var checkMostraIP = document.getElementById("customCheck2").checked            
                if (checkMostraIP) {
                    showip = true;
                }
                if(showip){
                    txt = headResultIP;
                }else{
                    txt = headResult;
                }
                readSingleLJ();
            }
            if (notfound) {
                document.getElementById("saida").innerHTML = resulttxt + lb+"Nada Encontrado"+lb+"Procurado em: "+x.length+" computadores";
            }  
        }
        document.getElementById("saida").innerHTML = resulttxt + cont+" computadore(s) de "+x.length + lb+txt;
        txt = "";
        ljx = "";        
        resulttxt = "";
    };

    function addZeros(){
        //Check the value entered on search field and fill with zeros at the beginning.
        //var ljbuscado = document.getElementById("ljbusca").value;            
        var ljSizeEntered = document.getElementById("ljbusca").value.length;            
        var ljZeros = 6 - ljSizeEntered;               
        zeros = zeros.repeat(parseInt(ljZeros,10));   
        ljx = zeros+ljx;          
        return ljx;
    };

    function readXML(x,i,codigoNovo,CodigoAtual){
        //read xml and populate vars.
        
        loja = parseInt(machine.substring(4,10))*1;
        if ((x[i].childNodes[5]) !== undefined) {
            srvtag = x[i].childNodes[5].innerHTML;
                        
        }else{
            srvtag = valdesativado;
        }

        if ((x[i].childNodes[9]) !== undefined) {
            model = x[i].childNodes[9].innerHTML;
        }else{
            model = valdesativado;
        }
        
        if(showip){
            ipnumber = x[i].childNodes[7].innerHTML;
            console.log("SHOW IP");
            console.log(x[i].childNodes[7].innerHTML);
            console.log(convertIP(ipnumber));
            ipnumber = convertIP(ipnumber);
        }
        
        
        if (codigoNovo) {
            if(showip){
                txt += inputField+loja+inputFieldEnd+separador+inputField+machine+inputFieldEnd+separador+inputField+model+inputFieldEnd+separador+inputField+srvtag+inputFieldEnd+separador+inputField+ipnumber+inputFieldEnd+spanred+" * "+CodigoAtual+spanend+lb
            }else{
                txt += inputField+loja+inputFieldEnd+separador+inputField+machine+inputFieldEnd+separador+inputField+model+inputFieldEnd+separador+inputField+srvtag+inputFieldEnd+spanred+" * "+CodigoAtual+spanend+lb    
            }   
        }else{
            if(showip){
                txt += inputField+loja+inputFieldEnd+separador+inputField+machine+inputFieldEnd+separador+inputField+model+inputFieldEnd+separador+inputField+srvtag+inputFieldEnd+separador+inputField+ipnumber+inputFieldEnd+lb
            }else{
                txt += inputField+loja+inputFieldEnd+separador+inputField+machine+inputFieldEnd+separador+inputField+model+inputFieldEnd+separador+inputField+srvtag+inputFieldEnd+lb
            }
            
        }
                
        console.log(i+"/"+x.length+"="+txt+"/"+model+"/"+srvtag);
    };

    function readArray(ljxArray){
        for (i = 0; i < x.length;i++) {                    
                    
            machine = x[i].firstElementChild.innerHTML;
            if ((x[i].childNodes[11]) !== undefined) {
                //if ((x[i].childNodes.length) > 11) { //works for checking node too
                    CodigoAtual = x[i].childNodes[11].innerHTML;
                    //console.log("i: "+i+" CodigoAtual: "+" = "+CodigoAtual+" Machine: "+machine);
                }

            for (j = 0; j < ljxArray.length-1; j++) {
                
                if (machine.includes(ljxArray[j])) {
                    
                    readXML(x,i,codigoNovo);
                    notfound = false; //returns False, so doesn't activate conditional if for "Nada Encontrado"
                    cont++; //Increments cont to use on display number of machines
                    
                }else if (CodigoAtual.includes(ljxArray[j])){
                    codigoNovo = true;
                    readXML(x,i,codigoNovo,CodigoAtual);
                    codigoNovo = false;
                    notfound = false; //returns False, so doesn't activate conditional if for "Nada Encontrado"
                    cont++; //Increments cont to use on display number of machines
                }
                
            }   
        }

    };

    function readSingleLJ(){
        for (i = 0; i < x.length;i++) {                    

            machine = x[i].firstElementChild.innerHTML;
            if ((x[i].childNodes[11]) !== undefined) {
            //if ((x[i].childNodes.length) > 11) { //works for checking node too
                CodigoAtual = x[i].childNodes[11].innerHTML;
                //console.log("i: "+i+" CodigoAtual: "+" = "+CodigoAtual+" Machine: "+machine);
            }
                if (machine.includes(ljx)) {

                    readXML(x,i,codigoNovo);
                    notfound = false; //returns False, so doesn't activate conditional if for "Nada Encontrado"
                    cont++; //Increments cont to use on display number of machines
                    
                } else if(CodigoAtual.includes(ljx)) {
                    codigoNovo = true;
                    readXML(x,i,codigoNovo,CodigoAtual);
                    codigoNovo = false;
                    notfound = false; //returns False, so doesn't activate conditional if for "Nada Encontrado"
                    cont++; //Increments cont to use on display number of machines
                }
        }

    };
    
}

function parseCSV(){
    var csvString = document.getElementById("inputcsv").value;
    
    var lojasPapas = Papa.parse(csvString);    
    
    for (let i = 0; i < lojasPapas.data.length - 1; i++) {
        var dataArray0 = lojasPapas.data[0][i];
        dataArray0 = dataArray0.toLocaleLowerCase();        
        if (dataArray0.includes("loja")) {    
            var lojaPosArrayCSV = i;    
            break;    
        }       
        
    }

    for (let i = 1; i < lojasPapas.data.length; i++) {    
        lojasVirgulas += lojasPapas.data[i][lojaPosArrayCSV]+",";    
    }
    
    return lojasVirgulas;
}

function convertIP(ipStr){
    var ipOriginal ="";
    var ipTemp = ipStr+"."; 
    var ipCalc;
    for (let i = 1; i <= 4;i++) {
        var posDot = ipTemp.indexOf(".");
        ipCalc = ipTemp.substring(0,posDot);
        ipCalc = ipCalc * 1;
        ipOriginal = ipOriginal + ipCalc + ".";
        ipTemp = ipTemp.substring(posDot+1);
        console.log("passo: "+i);
        console.log("ipTemp: "+ipTemp);
        console.log("ipOriginal: "+ipOriginal);
    }     
    ipOriginal = ipOriginal.substr(0, ipOriginal.length-1);
    return ipOriginal;
}

function limpaTudo(){
    location.reload();
    window.location.reload(true);
}

function Teste(){
    var ljx = parseCSV();
    document.getElementById("ljbusca").value = ljx;
}
