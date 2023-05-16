exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      primaryKey: true,
      type: 'VARCHAR(50)',
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads(id)',
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
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
