import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { connect } from "react-redux";

function Seo({ description, lang, meta, title, user }) {
  const metaDescription = description || "Sistema de Gerenciamento de Feiras";
  const titleTemplate = user.feira ? user.feira.nome : "Feirapp";
  const creator = "edertaveira.com";
  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={`%s | ${titleTemplate}`}
      meta={[
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          name: `twitter:card`,
          content: `summary`
        },
        {
          name: `twitter:creator`,
          content: creator
        },
        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: metaDescription
        }
      ].concat(meta)}
    />
  );
}

Seo.defaultProps = {
  lang: `pt-br`,
  meta: [],
  description: ``
};

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired
};

const mapStateToProps = appState => ({
  user: appState.user
});
export default connect(mapStateToProps)(Seo);
