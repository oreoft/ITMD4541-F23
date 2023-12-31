document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("tipForm");

	form.addEventListener("input", function () {
		var billTotalO = document.getElementById("billTotal").value
		if (billTotalO === "") {
			clear()
			return;
		}
		if (!isNumeric(billTotalO)) {
			alert("Please enter a valid number for Bill Total.");
			clear()
			return;
		}
		const billTotal = parseFloat(billTotalO);
		const tipPercentage = parseInt(document.getElementById("tip").value);
		console.log(billTotal)
		if (isNaN(billTotal)) {
			alert("Please enter a valid number for Bill Total.");
			clear()
			return;
		}

		const tipAmount = (billTotal * tipPercentage) / 100;
		const totalBill = billTotal + tipAmount;

		document.getElementById("tipPercentage").value = `${tipPercentage}%`;
		document.getElementById("tipAmount").value = tipAmount.toFixed(2);
		document.getElementById("totalBill").value = totalBill.toFixed(2);
	});
});

function clear() {
	document.getElementById("tipPercentage").value = ''
	document.getElementById("tipAmount").value = ''
	document.getElementById("totalBill").value = ''
	document.getElementById("billTotal").value = ''
}


function isNumeric(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}

