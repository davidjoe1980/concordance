import React from "react";
import {useDispatch} from "react-redux";
import {addProductToBasket} from "../../redux/actions/basketActions";
import {
    ActionsContainer,
    BasketButton,
    DescriptionContainer,
    ProductAuthor, ProductContainer,
    ProductImage,
    ProductPrice,
    ProductTitle,
    Container, WishlistButton, Section, ProductType
} from "../../styles/Component.styles";

export default function TemplateProduct( {product} ) {
    const dispatch = useDispatch();

    return (
        <Container style={{height: '200px'}}>
            <ProductContainer>
                <ProductImage w={'175px'} h={'180px'} src={product.imageUrl} alt="productImage"/>

                <DescriptionContainer>
                    <Section borderBottom>
                        <ProductTitle fontSize='18pt'>{product.longTitle}</ProductTitle>
                    </Section>

                    <Section style={{marginBottom: 'auto', marginTop: '40px'}}>
                        <ProductType>{product.type}</ProductType>
                        <ProductAuthor>By (author): {product.author}</ProductAuthor>
                    </Section>

                    <Section style={{marginBottom: '20px'}}>
                        <ProductAuthor>{product.description}</ProductAuthor>
                    </Section>

                </DescriptionContainer>


                <Section style={{marginLeft: '50px', width: '200px'}}>
                    <Section borderBottom style={{marginBottom: 'auto'}}>
                        <ProductPrice fontSize='22pt'>{numberWithSpaces(product.price)} Ft</ProductPrice>
                    </Section>

                    <Section style={{gap: '10px'}}>
                        <BasketButton w={200} h={40} onClick={() => dispatch(addProductToBasket(product))}>Add to basket</BasketButton>
                        <WishlistButton w={200  } h={40} onClick={() => dispatch(addProductToBasket(product))}>Add to wishlist</WishlistButton>
                    </Section>
                </Section>
            </ProductContainer>

        </Container>
    )
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}