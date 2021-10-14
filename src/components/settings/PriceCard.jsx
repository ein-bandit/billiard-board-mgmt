import React from 'react';
import NumberFormat from 'react-number-format';

const names = { billiard: 'Billard', dart: 'Dart' };
const PriceCard = ({ type, prices, setPrices }) => {
    const data = [
        { title: 'Standard Preis', message: '' },
        { title: 'Reduzierter Preis', message: 'Reduzierter Preis gilt in den unten angegebenen Zeitspannen' },
    ];
    return (
        <div className="card">
            <div className="card-header">{names[type]}</div>
            <div className="card-body">
                <div className="row">
                    {data.map((priceText, index) => {
                        return (
                            <div className="col-12" key={index}>
                                <div className="form-group row">
                                    <label className="col-sm-6 col-form-label">{priceText.title}</label>
                                    <div className="col-sm-6">
                                        <NumberFormat
                                            decimalSeparator=","
                                            decimalScale={2}
                                            allowNegative={false}
                                            fixedDecimalScale
                                            className="form-control"
                                            id="defaultPrice"
                                            value={index === 0 ? prices.price : prices.reduced}
                                            onValueChange={(values) => {
                                                console.log(values);
                                                const key = index === 0 ? 'price' : 'reduced';
                                                setPrices({ ...prices, [key]: values.floatValue });
                                            }}
                                        />
                                    </div>
                                    {priceText.message && (
                                        <small id="emailHelp" className="form-text text-muted ml-3">
                                            {priceText.message}
                                        </small>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PriceCard;
