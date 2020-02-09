function renderSample(objReportBrexit, objReportNatlElec, filterRegion){

	console.log("Render Sample");
	//------------------------ Render Brexit ------------------------------------------------------------------------------
	var arrTrace1 = [];

	objReportBrexit.regional_votes.brexit_replies.forEach(function(breply, indx){

		var xValues = [];
		var yValues = [];
		
		if(filterRegion.region_code == "ALL"){
			xValues = objReportBrexit.regional_votes.region_names;
			yValues = getElectionPercent(objReportBrexit.regional_votes.region_percent, indx);
		}else{
			var constData = objReportBrexit.regional_constituencies.filter(item => item.region_code == filterRegion.region_code)[0];
			xValues = constData.constituency_votes.const_names;
			yValues = getElectionPercent(constData.constituency_votes.const_percent, indx)
		}

		var trace = {
			x: xValues,
			y: yValues,				
			name: breply,
			type: 'bar'
		};

		arrTrace1.push(trace);
	});
			  
	var data1 = arrTrace1;
	
	var layout1 = {barmode: 'stack'};
	
	Plotly.newPlot('elsample_1', data1, layout1);


	//------------------------ Render National Election -------------------------------------------------------------------

	var arrTrace2 = [];

	objReportNatlElec[0].top_parties.parties.forEach(function(party, indx){

		var xValues = [];
		var yValues = [];
		
		if(filterRegion.region_code == "ALL"){
			xValues = objReportNatlElec[0].regional_votes.region_names;
			yValues = getElectionPercent(objReportNatlElec[0].regional_votes.region_percent, indx);
		}else{
			var constData = objReportNatlElec[0].regional_constituencies.filter(item => item.region_code == filterRegion.region_code)[0];
			//console.log(constData);
			xValues = constData.constituency_votes.const_names;
			yValues = getElectionPercent(constData.constituency_votes.const_percent, indx)
		}

		var trace = {
			x: xValues,
			y: yValues,				
			name: party,
			type: 'bar'
		};

		arrTrace2.push(trace);
	});
			  
	var data2 = arrTrace2;
	
	var layout2 = {barmode: 'stack'};
	
	Plotly.newPlot('elsample_2', data2, layout2);

}