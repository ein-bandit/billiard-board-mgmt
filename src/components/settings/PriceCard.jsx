import React from 'react';
import NumberFormat from 'react-number-format';

const names = { billiard: 'Billard', dart: 'Dart' };
const PriceCard = ({ type, prices, setPrices }) => {
    const rows = ['Standard Preis', 'Reduzierter Preis'];

    return (
        <div className="card">
            <div className="card-header">{names[type]}</div>
            <div className="card-body">
                <div className="row">
                    {rows.map((priceText, index) => {
                        return (
                            <div className="col-12" key={index}>
                                <div className="form-group row">
                                    <label className="col-sm-6 col-form-label">{priceText}</label>
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
