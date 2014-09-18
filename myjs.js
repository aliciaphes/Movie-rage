
// Movie apis I'll be using:
// Rotten tomatoes, ombd, USA Today, http://www.themoviedb.org/documentation/api

$(document).ready(function(){

	var baseUrl, moviesSearchUrl, rating, numResults;
	var tableContent, i, listElement, searchTerm, newSearchTerm;
	var keys      = [];

	var API_ARRAY = ["rotten", "omdb", "usatoday", "themoviedb"];

	var FUNC_ARRAY = [

		function retrieveRTresults(searchTerm, apiKey, tableNum){

			baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

			// construct the uri with our apiKey
			moviesSearchUrl = baseUrl + '/movies.json?apiKey=' + apiKey;

			//$("#resultList"+tableNum+" ul").html("");
			$.ajax({
				url : moviesSearchUrl + '&q=' + encodeURI(searchTerm),
				dataType : "jsonp",
				//success : successCallback
				success : function(data) {// callback for when we get back the results
					//Implementing here because I wanted to use searchTerm

					$("#webSource"+tableNum).html("<br/>Rotten Tomatoes results");

					//$("#resultList"+tableNum).html("");
					$.each(data.movies, function(index, movie) {
						rating = Number(movie.ratings["critics_score"]);
						if(rating != -1){
							rating = (rating/10.0).toFixed(1); //parseInt
							listElement = $('<li>'
								+ '<input type="radio" data-rating="' + rating
								+ '" name="' + API_ARRAY[tableNum] + '">'
								+ "Rating = " + rating
								//+ "<img src=" + movie.posters.thumbnail + ">"
								+ '<span>'+ movie.title + '</span>'
								+ "</li>");

							//$("#resultList"+tableNum).append(listElement);
							$("#resultList"+tableNum+" ul").append(listElement);
						}
					});
					numResults = $("#resultList"+tableNum+" ul li").length;
					//.children().length;
					if(numResults == 0) $("#numResults"+tableNum).addClass('alert alert-danger');
					$("#numResults"+tableNum).text('Found ' + numResults + " results for '" + searchTerm + "'");
				},
				error: function (result) {
                	alert("Error");
            	}			
			});//end ajax call
		},

		function retrieveOMDBresults(searchTerm, apiKey, tableNum){

			baseUrl = "http://www.omdbapi.com/"

			$.ajax({
				url : baseUrl + '?s=' + encodeURI(searchTerm),
				dataType : "jsonp",
				success : function(data) {
					
					$("#webSource"+tableNum).html("<br/>OMDB results");

					var movies = data.Search;

					if(movies != undefined){

						//$("#resultList"+tableNum+" ul").html("");
						$.each(movies, function(index, movie) {
							baseUrl = "http://www.omdbapi.com/"
							$.ajax({
								url : baseUrl + '?i=' + encodeURI(movie.imdbID),
								dataType : "jsonp",
								//jsonpCallback : 'myjsonpcallback',
								success : function(data) {
									if(data.imdbRating != "N/A"){
										rating = Number(data.imdbRating).toFixed(1);
										listElement = $('<li>'
											+ '<input type="radio" data-rating="' + rating + '" name="' + API_ARRAY[tableNum] + '">'
											+ "Rating = " + rating
											//+ "<img src=" + data.Poster + ">"
											+ '<span>'+ movie.Title + '</span>'
											+ "</li>");

										$("#resultList"+tableNum+" ul").append(listElement);
									}
								},
								complete : function(jqXHR, textStatus){
									if(textStatus == "success"){
										numResults = $("#resultList"+tableNum+" ul li").length;
										$("#numResults"+tableNum).text('Found ' + numResults + " results for '" + searchTerm + "'");
									}

								},
								error: function (result) {
	                				alert("Error");
	            				}
							});
						});
					}
					else{
						$("#numResults"+tableNum).addClass('alert alert-danger').text("Found 0 results for '" + searchTerm + "'");
					}

				},
				error: function (result) {
                	alert("Error");
            	}
			});
		},

		function retrieveUTresults(searchTerm, apiKey, tableNum){
			baseUrl = "http://api.usatoday.com/open/reviews/movies"

			var url = baseUrl + '/movies/' + encodeURI(searchTerm) + '?encoding=json&api_key=' + apiKey;

			//searchTerm = replaceAll(searchTerm, " ", "+");

			$.getJSON(url, function(data){

				$("#webSource"+tableNum).html("<br/>USA Today results");

 				if(data.Found != 0){

					//$("#resultList"+tableNum+" ul").html("");
 					$(data.MovieReviews).each(function( index, movie ) {
						rating = (Number(movie.Rating)*10.0)/4;
						listElement = $('<li>'
							+'<input type="radio" data-rating="' + rating + '" name="' + API_ARRAY[tableNum] + '">'
							+ "Rating = " + rating.toFixed(1)
							+ '<span>'+ movie.MovieName + '</span>'
							//+ '<span>'+ movie.WebUrl + '</span>'
							+ "</li>");

						$("#resultList"+tableNum+" ul").append(listElement);
					});

 				}
				numResults = $("#resultList"+tableNum+" ul li").length;
				if(numResults == 0){
					$("#numResults"+tableNum).addClass('alert alert-danger');
					//$("#resultList"+tableNum).remove();
				}
				$("#numResults"+tableNum).text('Found ' + numResults + " results for '" + searchTerm + "'");
			})
			.fail(function() {
				alert( "error" );
  			});
		},

		function retrieveTMDBresults(searchTerm, apiKey, tableNum){
			baseUrl = "http://api.themoviedb.org/3/"

			var url = baseUrl + 'search/movie?api_key=' + apiKey + '&query=' + encodeURI(searchTerm);

			$.ajax({
				url : url,
				dataType : "jsonp",
				success : function(data) {
 					
 					$("#webSource"+tableNum).html("<br/>The Movie DB results");

					//console.log(data.results);
 					$(data.results).each(function( index, movie ) {
						rating = (Number(movie.vote_average));
						if(rating != 0){
							listElement = $('<li>'
								+'<input type="radio" data-rating="' + rating + '" name="' + API_ARRAY[tableNum] + '">'
								+ "Rating = " + rating.toFixed(1)
								+ '<span>'+ movie.title + '</span>'
								//+ '<span>'+ movie.poster_path + '</span>'
								+ "</li>");

							$("#resultList"+tableNum+" ul").append(listElement);
						}
					});
					numResults = $("#resultList"+tableNum+" ul li").length;
					if(numResults == 0) $("#numResults"+tableNum).addClass('alert alert-danger');
					$("#numResults"+tableNum).text('Found ' + numResults + " results for '" + searchTerm + "'");
				}
			});
		}	
	];//end array of functions



	function replaceAll(string, find, replace) {
		find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		return string.replace(new RegExp(find, 'g'), replace);
	}

	function successKeys(data, status, jqXHR){
		var found;
		if(status == "success"){

			for(i=0; i<API_ARRAY.length; i++){

				found = false;

				$.each( data, function( key, val ) {
					//console.log("comparing "+key+" and "+API_ARRAY[i]);
					if(API_ARRAY[i] == key){
						found = true;
						keys.push(val);
					}
				});
				if(!found) keys.push("");
			}
		}

	}

	function retrieveKeys(){

		$.ajax({
			async: false, //so we can retrieve the keys array later
			dataType: "json",
			url: 'http://localhost:8000/keys.json',
		  	success: successKeys
		});
	}	


	$("#search_button").on("click", function(event) {

		newSearchTerm = $("#search_field").val();

		if(newSearchTerm && newSearchTerm != searchTerm){

			$("#errorDiv").addClass("hidden").html("");

			retrieveKeys();
			//console.log(keys);

			$("#dynTable").html("");

			for(i=1; i<2; i++){
			/**
			The final one
			for(i=0; i<FUNC_ARRAY.length; i++){
			*/	
				tableContent = $('<label id="webSource' + i + '"></label><br/><br/>');
				$("#dynTable").append(tableContent);

				tableContent = $('<label id="numResults' + i + '"></label>');
				$("#dynTable").append(tableContent);

				tableContent = $('<div id="resultList' + i + '"><ul></ul></div>');
				$("#dynTable").append(tableContent);

				$("#resultList" + i + " ul").html("");
				$("#numResults" + i).removeClass('alert alert-danger');

				FUNC_ARRAY[i](newSearchTerm, keys[i], i);
			} 

			$("#calculateButton").removeClass("hidden");

			searchTerm = newSearchTerm;
		}
		else if(!newSearchTerm){
			$("#dynTable").html("");
			$("#calculateButton").addClass("hidden");
			$("#errorDiv").removeClass("hidden").html("Please enter some search term");
		}

	});



	$("#calculateButton").on("click", function(event) {
		var error = false;
		var n, element, value, average = 0.0;

		$("#errorDiv").html("").addClass('hidden');

		for(i=0; i<API_ARRAY.length; i++){

			if($("#resultList" + i).length){//if results block exists
				element = "#resultList" + i +" li input:radio:checked";
				value = $(element).data("rating");

				if(value == undefined){	
					error = true;
					$("#errorDiv").append("no radio button from group '" + API_ARRAY[i] + "' is checked<br/>").removeClass('hidden');				
				}
				else{
					//console.log("value ok");
					//store value to calculate average afterwards:
					average += Number(value);
				}
			}
		}

		if(!error){

			//see how many divs are showing results:
			n = $("#dynTable > div").length;

			average = (average/n).toFixed(1);
			alert("average = " + average);
		}


	});

});//end ready




