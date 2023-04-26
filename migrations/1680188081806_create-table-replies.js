/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      primaryKey: true,
      type: 'VARCHAR(50)',
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      defaultValue: false,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },

  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
