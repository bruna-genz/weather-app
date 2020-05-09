export const dayLengthView = (dayLength, sunrise, sunset) => {
    return `<h4>Sunrise / Sunset</h4>
    <div id="length-info">
        <div id="length-images">
            <div>
                <div id="sunrise-img"></div>
                <p>${sunrise}</p>
            </div>
            <div>
                <div id="sunset-img"></div>
                <p>${sunset}</p>
            </div>
        </div>
        <p id="lenght-paragraph">Day length: <br> ${dayLength}</p>
    </div>`
}