import {
  NewListItemContainer,
  NewListItemContainerBackground,
  NewListItemForm,
  NewListItemFormRow,
} from "./styles";
import PrimaryInput from "../PrimaryInput";

export default ({
  labelColor,
  labelBackground,
  activeIconColor,
  offIconColor,
  setProduct,
  setPrice,
  setAmount,
}) => {
  return (
    <NewListItemContainer>
      <NewListItemForm>
        <PrimaryInput
          width={24}
          labelValue='Produto'
          labelColor={labelColor}
          labelBackground={labelBackground}
          type='text'
          autoComplete='off'
          secure={false}
          activeIconColor={activeIconColor}
          offIconColor={offIconColor}
          changeHandle={setProduct}
        />
        <NewListItemFormRow>
          <PrimaryInput
            width={12}
            labelValue='Preço'
            labelColor={labelColor}
            labelBackground={labelBackground}
            type='numeric'
            autoComplete='off'
            secure={false}
            activeIconColor={activeIconColor}
            offIconColor={offIconColor}
            changeHandle={setPrice}
          />
          <PrimaryInput
            width={12}
            labelValue='Quantia'
            labelColor={labelColor}
            labelBackground={labelBackground}
            type='decimal'
            autoComplete='off'
            secure={false}
            activeIconColor={activeIconColor}
            offIconColor={offIconColor}
            changeHandle={setAmount}
          />
        </NewListItemFormRow>
      </NewListItemForm>
      <NewListItemContainerBackground background={labelBackground} />
    </NewListItemContainer>
  );
};
