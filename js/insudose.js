let itemObj={
		
};
const items = [];


$(document).ready(function() {
	$('#div_chooseEyes').hide();
	readcsvv();
	//console.log(items);
  

	// Get references to the search box, search results list, and label box
	
	
	const searchBox = document.getElementById("search-box");
	const searchResults = document.getElementById("search-results");
	const labelBox = document.getElementById("label-box");
	
	// Define a function to filter the items array based on the search term
	const filterItems = (searchTerm) => {
  		return items.filter(item => item.English_Description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
	};

	

	const filterItemsByType = (medicineType ) =>{
		//console.log(items.length);
		const filteredItems = [];
		for (let i = 1; i < items.length; i++) {
			const item = items[i];
			if (item.type.toLowerCase() === medicineType ) {
			filteredItems.push(item);
			}
  		}

		  filteredItems.sort((a, b) => a.English_Description.localeCompare(b.English_Description));

  		return filteredItems;
	};


	const renderSearchResults = results => {
		const resultsList = $("#search-results");
		resultsList.empty();
		const table = $("<table>", { class: "table table-striped" });
		results.forEach(result => {
		  const tr = $("<tr>");
		  const nameTd = $("<td>", { text: result.English_Description });
		  const imgTd = $("<td>").append($("<img>", { src: result.ImageUrl, height: 70 }));
		  tr.append(nameTd);
		  tr.append(imgTd);
		  tr.click(() => {
			clearAllBox();
			$("#label-box").text(result.English_Description);
			$('#img_items').attr("src", result.ImageUrl);
			itemObj = result;
			//console.log(itemObj);
		  });
		  table.append(tr);
		});
		resultsList.append(table);
	  };

	// Add an event listener to the search box to update the search results list
	searchBox.addEventListener("input", () => {
	  const searchTerm = searchBox.value;
	  const filteredItems = filterItems(searchTerm);
	  renderSearchResults(filteredItems);
	});

    //----------------------- button clicks -----------------//
	$('#btn_Insulin').click(function(){
		selectedMedicineType = "insulin";
		const filteredItems = filterItemsByType(selectedMedicineType);
		//console.log(filteredItems);
		renderSearchResults(filteredItems);

		$('#txt_freq').attr("placeholder", "Day Units");
		$('#div_chooseEyes').hide();
	});
	$('#btn_Drops').click(function(){
		selectedMedicineType = "drops";
		const filteredItems = filterItemsByType(selectedMedicineType);
		//console.log(filteredItems);
		renderSearchResults(filteredItems);
		
		$('#txt_freq').attr("placeholder", "Frequency");
		$('#div_chooseEyes').show();
	});
	$('#btn_Antibiotics').click(function(){
		selectedMedicineType = "antibiotic";
		const filteredItems = filterItemsByType(selectedMedicineType);
		//console.log(filteredItems);
		renderSearchResults(filteredItems);

		$('#txt_freq').attr("placeholder", "Frequency");
		$('#div_chooseEyes').hide();
	});
	$('#btn_Tablets').click(function(){
		selectedMedicineType = "tablet";
		const filteredItems = filterItemsByType(selectedMedicineType);
		//console.log(filteredItems);
		renderSearchResults(filteredItems);

		$('#txt_freq').attr("placeholder", "Frequency");
		$('#div_chooseEyes').hide();
	});
	//----------------------- button clicks -----------------//
  
	//----------------------- connect with api
	function startCalculate() {
		
		var _rms=itemObj.RMS;
		var _freq=$('#txt_freq').val();
		var _days=$('#txt_days').val();
		var _isbupa="false";
		

		var radioBtnEyes = $('#btn_Drops');
		var radioBtnBothEyes = $('#both_eyes_ears');
		// Check if the radio button is checked
		if (radioBtnEyes.prop('checked')) {
			if (radioBtnBothEyes.prop('checked')) {
				_freq=_freq * 2;
				//console.log(_freq);
			}
		}

		//check bupa or not
		var radiobupa = $('#isBupaOrNot');
		if (radiobupa.prop('checked')) {
			_isbupa='true';
				//console.log(_freq);
		}else{_isbupa='false';}

		const _GetValue=_rms+","+_freq+","+_days+","+_isbupa
		console.log(_GetValue);

		$.ajax({
			url: 'https://telescope-web.com/insu/calcDose/' +_GetValue ,
			dataType: 'text',
			cache: false,
			success: function (data, statue) {
				//console.log(data);
				$('#txt_dose').text(data);
			},
			error: function () {
				console.log('Failed');
			}
		});
	}

    function readcsvv() {
	  $.ajax({
		type: "GET",
		url: "/db/_DbwithImage.csv",
		dataType: "text",
		success: function(data) {
			//console.log(data);
			processData(data);
			//const outputDiv = document.getElementById("output");
			//items.forEach(item => {
			//outputDiv.innerHTML += createHTML(item);
			//});
 		 },
		error: function(xhr, textStatus, errorThrown) {
			console.log("Error loading CSV file: " + errorThrown);
 		 }
	});
    }

	function clearAllBox(){
		$('#txt_freq').val('');
		$('#txt_days').val('');
		$('#search-box').val('');
		$('#txt_dose').text('0.0');
	}

	function processData(csv) {
		var lines = csv.split("\n");
		//var itemss = [];
		
		for (var i = 1; i < lines.length-1; i++) {
			var line = lines[i].split(",");
			var RMS = line[0];
			var Arabic_Description =line[1];
			var English_Description = line[2];
			var type = line[3];
			var units =  line[4] ;
			var unit_type = line[5] ;
			var FreqType = line[6];
			var ImageUrl = line[7];
			 

			items.push({
				RMS: RMS,
				Arabic_Description:Arabic_Description,
				English_Description: English_Description,
				type: type,
				units: units,
				unit_type: unit_type,   
				FreqType: FreqType,
				ImageUrl:ImageUrl
				
			});

			
		}

	}
});