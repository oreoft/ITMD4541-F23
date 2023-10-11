document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("tipForm");

	form.addEventListener("input", function () {
		const billTotal = parseFloat(document.getElementById("billTotal").value);
		const tipPercentage = parseInt(document.getElementById("tip").value);

		if (isNaN(billTotal)) {
			alert("Please enter a valid number for Bill Total.");
			return;
		}

		const tipAmount = (billTotal * tipPercentage) / 100;
		const totalBill = billTotal + tipAmount;

		document.getElementById("tipPercentage").value = `${tipPercentage}%`;
		document.getElementById("tipAmount").value = tipAmount.toFixed(2);
		document.getElementById("totalBill").value = totalBill.toFixed(2);
	});
});
