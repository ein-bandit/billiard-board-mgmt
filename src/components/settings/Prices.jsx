import React from 'react';
import PriceCard from './PriceCard';

const Prices = ({ prices, setPrices }) => {
    return (
        <div className="row">
            {Object.keys(prices).map((key, index) => {
                return (
                    <div className="col-6" key={index}>
                        <PriceCard
                            type={key}
                            key={index}
                            prices={prices[key]}
                            setPrices={(updatedPrices) => {
                                const update = { ...prices, [key]: updatedPrices };
                                setPrices(update);
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Prices;
