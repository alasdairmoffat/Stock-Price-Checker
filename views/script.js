$(() => {
  $('#testForm').submit((e) => {
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#testForm').serialize(),
      success(data) {
        $('#jsonResult').text(JSON.stringify(data));
      },
    });
    e.preventDefault();
  });
  $('#testForm2').submit((e) => {
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#testForm2').serialize(),
      success(data) {
        $('#jsonResult').text(JSON.stringify(data));
      },
    });
    e.preventDefault();
  });
});
