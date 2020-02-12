function renderSummary(objReportBrexit, objReportNatlElec, filterRegion){
    
    console.log("Render Summary");

    //------ Brexit -------------
       var arrValues1 = [];
       var arrLabels1 = ["LEAVE","REMAIN"];

       if(filterRegion.region_code == "ALL"){
            arrValues1.push(objReportBrexit.total_pct_leave);
            arrValues1.push(objReportBrexit.total_pct_remain);
       }else{
            var indx = objReportBrexit.regional_votes.region_codes.findIndex(item => item == filterRegion.region_code);            
            arrValues1 = objReportBrexit.regional_votes.region_percent[indx];           
       }

      var data1 = [{
        values: arrValues1,
        labels: arrLabels1,
        type: 'pie'
      }];
      
      var layout1 = {
        height: 300,
        width: 500
      };
      
      Plotly.newPlot('elsummary_1', data1, layout1);

   //----- UK Election ---------

   var arrValues2 = [];
   var arrLabels2 = objReportNatlElec[0].top_parties.parties;

   //console.log(objReportNatlElec);
   if(filterRegion.region_code == "ALL"){
        arrValues2 = objReportNatlElec[0].top_parties.parties_percent;
        
   }else{
        var indx = objReportNatlElec[0].regional_votes.region_codes.findIndex(item => item == filterRegion.region_code);            
        arrValues2 = objReportNatlElec[0].regional_votes.region_percent[indx];           
   }

  var data2 = [{
    values: arrValues2,
    labels: arrLabels2,
    type: 'pie'
  }];
  
  var layout2 = {
    height: 300,
    width: 500
  };
  
  Plotly.newPlot('elsummary_2', data2, layout2);
    
}