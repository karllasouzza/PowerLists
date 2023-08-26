import {
  NewListItemContainer,
  NewListItemContainerBackground,
  NewListItemForm,
  NewListItemFormRow,
} from "./styles";
import PrimaryInput from "../PrimaryInput";
import ColorCard from "./ColorCard";

export default ({
  type,
  background,
  labelColor,
  labelBackground,
  setProduct,
  setPrice,
  setAmount,
  colors,
  colorSelected,
  setColor,
  onEdit,
  values: { title, price, amount },
  errorColor,
  error,
  onSelectedColor,
  selectedColor
}) => {
  return (
    <NewListItemContainer>
      <NewListItemForm>
        <PrimaryInput
          width={100}
          labelValue={type === "ListItems" ? "Produto" : "Titulo"}
          labelColor={error === "title" ? errorColor : labelColor}
          labelBackground={labelBackground}
          type='text'
          autoComplete='off'
          secure={false}
          changeHandle={setProduct}
          edit={onEdit}
          value={title}
        />
        <NewListItemFormRow>
          {type === "ListItems" ? (
            <PrimaryInput
              width={12}
              labelValue='Preço'
              labelColor={labelColor}
              labelBackground={labelBackground}
              type='numeric'
              autoComplete='off'
              secure={false}
              changeHandle={setPrice}
              edit={onEdit}
              value={price}
            />
          ) : null}
          {type === "ListItems" ? (
            <PrimaryInput
              width={10}
              labelValue='Quantia'
              labelColor={error === "amount" ? errorColor : labelColor}
              labelBackground={labelBackground}
              type='numeric'
              autoComplete='off'
              secure={false}
              changeHandle={setAmount}
              edit={onEdit}
              value={amount}
            />
          ) : null}
          {type === "Lists"
            ? colors?.map((color, index) => (
                <ColorCard
                  key={index}
                  color={color}
                  width={40}
                  height={40}
                  tap={setColor}
                  selected={colorSelected}
                  onSelectedColor={onSelectedColor}
                  selectedColor={selectedColor}
                />
              ))
            : null}
        </NewListItemFormRow>
      </NewListItemForm>
      <NewListItemContainerBackground background={background} />
    </NewListItemContainer>
  );
};
