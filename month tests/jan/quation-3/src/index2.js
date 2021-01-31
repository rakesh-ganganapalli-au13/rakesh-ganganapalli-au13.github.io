function CheckDigitSum(number) {

    let nums = number.split('');
    if (nums.length > 1) {
        let sum = 0;
        for (let i = 0; i < nums.length; i++) {
            sum += Number(nums[i]);
        }
        return CheckDigitSum(sum.toString());
    } else {
        return parseInt(nums[0]);
    }
}

console.log(CheckDigitSum("55555"))