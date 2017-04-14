import numeral from "numeral"

export const formatMoney = function(amount, includeSymbol){
    var format = "($0[.]0a)";
    if (!includeSymbol) {
        format = "(0[.]0a)"
    }
    return numeral(amount).format(format);
}

export const getBudgetString = (deal, notQuotedString="Not Quoted") => {
    if (!deal){
        return ""
    }
    var budget = deal.budget
    if (!budget) {
        return notQuotedString;
    }
    if (budget.low == budget.high) {
        if (budget.low > 0) {
            return formatMoney(budget.low, true);
        }
        return notQuotedString;
    }
    return formatMoney(budget.low, true) + " - " + formatMoney(budget.high, false);
}
