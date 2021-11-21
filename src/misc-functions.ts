export const tableRowforEach = (tableID: string, rowCallback: (rowEle: HTMLTableRowElement, rowIndex: number) => void) => {
	let table = document.getElementById(tableID);
	if (table) {
		let rowIndex = 0;
		let rows = table.querySelector('tbody')?.getElementsByTagName('tr')
		for(const row of rows!){
			rowCallback(row, rowIndex);
			rowIndex++;
		}
	}
}


export function union<T>(setA: Set<T>, setB: Set<T>) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

export function difference<T>(setA: Set<T>, setB: Set<T>) {
    let _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}